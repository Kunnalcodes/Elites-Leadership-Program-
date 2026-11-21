import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { xpService } from '../xp/xp.service.js';
import { leaderboardService } from '../leaderboard/leaderboard.service.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors.js';
import { SUBMISSION_STATUSES, ROLES, XP_TRANSACTION_TYPES } from '../../config/constants.js';

export interface EvaluateSubmissionDto {
  versionNumber?: number;
  criteriaScores: { criterionId: string; score: number; feedback?: string }[];
  generalFeedback?: string;
  evaluatorNotes?: string;
  isDraft?: boolean;
}

export class GradingService {
  async evaluateSubmission(submissionId: string, dto: EvaluateSubmissionDto, evaluator: any) {
    const submission = db.submissions.get(submissionId);
    if (!submission) throw new NotFoundError('Submission not found');

    const task = db.tasks.get(submission.taskId);
    if (!task) throw new NotFoundError('Task not found');

    const versionNum = dto.versionNumber || submission.currentVersion;
    let targetVersion: any = null;
    for (const v of db.submissionVersions.values()) {
      if (v.submissionId === submissionId && v.versionNumber === versionNum) {
        targetVersion = v;
        break;
      }
    }

    if (!targetVersion) {
      throw new NotFoundError(`Submission version ${versionNum} not found`);
    }

    // Lookup rubric
    let rubric: any = null;
    for (const r of db.taskRubrics.values()) {
      if (r.taskId === task.id) {
        rubric = r;
        break;
      }
    }

    // Validate criteria scores
    let totalScore = 0;
    const scoredCriteria = [];
    for (const item of dto.criteriaScores) {
      const crit = db.taskRubricCriteria.get(item.criterionId);
      if (!crit) throw new ValidationError(`Criterion ID ${item.criterionId} does not belong to rubric`);
      if (item.score < 0 || item.score > crit.maxScore) {
        throw new ValidationError(`Score for "${crit.title}" must be between 0 and ${crit.maxScore}`);
      }
      totalScore += item.score;
      scoredCriteria.push({ crit, item });
    }

    const maxPossibleScore = rubric?.totalMaxScore || 100;
    const isLate = targetVersion.isLate;
    let eligibleXP = Math.round((totalScore / maxPossibleScore) * task.maxXP);

    // Apply late penalty deduction if applicable
    if (isLate && task.latePenaltyPercent) {
      const penalty = Math.round(eligibleXP * (task.latePenaltyPercent / 100));
      eligibleXP = Math.max(0, eligibleXP - penalty);
    }

    const isDraft = dto.isDraft ?? false;

    // Check existing evaluation for this version
    let evaluation: any = null;
    for (const ev of db.evaluations.values()) {
      if (ev.submissionId === submissionId && ev.versionId === targetVersion.id) {
        evaluation = ev;
        break;
      }
    }

    if (evaluation) {
      evaluation.evaluatorId = evaluator.id;
      evaluation.totalScore = totalScore;
      evaluation.maxPossibleScore = maxPossibleScore;
      evaluation.xpAwarded = eligibleXP;
      evaluation.generalFeedback = dto.generalFeedback || evaluation.generalFeedback;
      evaluation.evaluatorNotes = dto.evaluatorNotes || evaluation.evaluatorNotes;
      evaluation.isDraft = isDraft;
      evaluation.updatedAt = new Date();
    } else {
      const evaluationId = uuidv4();
      evaluation = {
        id: evaluationId,
        submissionId,
        versionId: targetVersion.id,
        evaluatorId: evaluator.id,
        totalScore,
        maxPossibleScore,
        xpAwarded: eligibleXP,
        generalFeedback: dto.generalFeedback || null,
        evaluatorNotes: dto.evaluatorNotes || null,
        isDraft,
        isPublished: false,
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.evaluations.set(evaluationId, evaluation);
    }

    // Save criteria scores
    for (const { crit, item } of scoredCriteria) {
      const scoreKey = `${evaluation.id}-${crit.id}`;
      db.evaluationCriteriaScores.set(scoreKey, {
        id: scoreKey,
        evaluationId: evaluation.id,
        criterionId: crit.id,
        score: item.score,
        feedback: item.feedback || null,
      });
    }

    // Update submission status
    submission.status = isDraft ? SUBMISSION_STATUSES.UNDER_REVIEW : SUBMISSION_STATUSES.GRADED;
    submission.updatedAt = new Date();

    db.recordAuditLog({
      actorId: evaluator.id,
      actorEmail: evaluator.email,
      actorRole: evaluator.role,
      action: isDraft ? 'EVALUATION_DRAFT_SAVED' : 'EVALUATION_COMPLETED',
      entity: 'Evaluation',
      entityId: evaluation.id,
      newState: { totalScore, maxPossibleScore, eligibleXP, isDraft },
      reason: `Task Master evaluated submission version ${versionNum}`,
    });

    if (!isDraft) {
      // Auto-publish if finalized
      await this.publishEvaluation(evaluation.id, evaluator);
    }

    return {
      evaluationId: evaluation.id,
      submissionId,
      totalScore,
      maxPossibleScore,
      eligibleXP,
      isDraft,
      isPublished: evaluation.isPublished,
    };
  }

  /**
   * Finalizes and Publishes an Evaluation
   * Issues XP Transaction, recalculates leaderboard, sends result notification
   */
  async publishEvaluation(evaluationId: string, actor: any) {
    const evaluation = db.evaluations.get(evaluationId);
    if (!evaluation) throw new NotFoundError('Evaluation not found');

    if (evaluation.isPublished) {
      return { evaluationId, message: 'Evaluation is already published' };
    }

    const submission = db.submissions.get(evaluation.submissionId);
    if (!submission) throw new NotFoundError('Submission not found');

    const task = db.tasks.get(submission.taskId);
    if (!task) throw new NotFoundError('Task not found');

    const now = new Date();
    evaluation.isDraft = false;
    evaluation.isPublished = true;
    evaluation.publishedAt = now;
    evaluation.updatedAt = now;

    submission.status = SUBMISSION_STATUSES.RESULT_PUBLISHED;
    submission.updatedAt = now;

    // Update assignment status
    for (const a of db.taskAssignments.values()) {
      if (a.taskId === task.id && a.eliteId === submission.eliteId) {
        a.status = SUBMISSION_STATUSES.RESULT_PUBLISHED;
      }
    }

    // 1. Issue XP Transaction in Ledger
    const xpTransaction = await xpService.awardTaskXp({
      eliteId: submission.eliteId,
      amount: evaluation.xpAwarded,
      taskId: task.id,
      evaluationId: evaluation.id,
      reason: `Score ${evaluation.totalScore}/${evaluation.maxPossibleScore} on task: ${task.title}`,
      issuingAdminId: actor.id,
    });

    // 2. Recalculate Leaderboard
    await leaderboardService.recalculateStandings();

    // 3. Notify Elite of Published Result
    const notifId = uuidv4();
    db.notifications.set(notifId, {
      id: notifId,
      userId: submission.eliteId,
      eventType: 'SUBMISSION_RESULT_PUBLISHED',
      title: `Evaluation Result Published: ${task.title}`,
      message: `Your work has been evaluated. Score: ${evaluation.totalScore}/${evaluation.maxPossibleScore}. You earned +${evaluation.xpAwarded} XP!`,
      dataJson: {
        taskId: task.id,
        score: evaluation.totalScore,
        maxScore: evaluation.maxPossibleScore,
        xpAwarded: evaluation.xpAwarded,
        feedback: evaluation.generalFeedback,
      },
      channel: 'IN_APP',
      deliveryStatus: 'DELIVERED',
      isRead: false,
      createdAt: now,
    });

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'EVALUATION_PUBLISHED',
      entity: 'Evaluation',
      entityId: evaluationId,
      newState: { score: evaluation.totalScore, xpAwarded: evaluation.xpAwarded, xpTransactionId: xpTransaction.id },
      reason: 'Administrator published evaluation and posted XP ledger transaction',
    });

    return {
      evaluationId,
      status: 'PUBLISHED',
      xpAwarded: evaluation.xpAwarded,
      xpTransactionId: xpTransaction.id,
      publishedAt: now,
    };
  }

  async requestRevision(submissionId: string, reason: string, actor: any) {
    const submission = db.submissions.get(submissionId);
    if (!submission) throw new NotFoundError('Submission not found');

    const task = db.tasks.get(submission.taskId);
    submission.status = SUBMISSION_STATUSES.REVISION_REQUESTED;
    submission.updatedAt = new Date();

    const notifId = uuidv4();
    db.notifications.set(notifId, {
      id: notifId,
      userId: submission.eliteId,
      eventType: 'REVISION_REQUESTED',
      title: `Revision Requested: ${task?.title || 'Submission'}`,
      message: `The evaluator has requested improvements on your submission: "${reason}". Please review feedback and submit an updated version.`,
      dataJson: { submissionId, reason },
      channel: 'IN_APP',
      deliveryStatus: 'DELIVERED',
      isRead: false,
      createdAt: new Date(),
    });

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'REVISION_REQUESTED',
      entity: 'Submission',
      entityId: submissionId,
      reason,
    });

    return { submissionId, status: submission.status, reason };
  }
}

export const gradingService = new GradingService();
