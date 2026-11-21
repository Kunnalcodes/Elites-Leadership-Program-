import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { TokenSecurity } from '../../infrastructure/security/tokens.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors.js';
import { SUBMISSION_STATUSES, ROLES } from '../../config/constants.js';

export interface SubmitTaskDto {
  textResponse?: string;
  files?: { fileName: string; fileUrl: string; fileType: string; fileSize: number; storageKey?: string }[];
  links?: { label: string; url: string; platform?: string }[];
}

export class SubmissionsService {
  async submitTask(taskId: string, eliteId: string, dto: SubmitTaskDto) {
    const task = db.tasks.get(taskId);
    if (!task) throw new NotFoundError('Task not found');

    // Find assignment
    let assignment: any = null;
    for (const a of db.taskAssignments.values()) {
      if (a.taskId === taskId && a.eliteId === eliteId) {
        assignment = a;
        break;
      }
    }

    if (!assignment) {
      throw new ForbiddenError('You are not assigned to this task');
    }

    // Deadline check with grace period
    const now = new Date();
    const effectiveDeadline = assignment.deadlineOverride 
      ? new Date(assignment.deadlineOverride) 
      : new Date(task.submissionDeadline);

    const graceLimit = new Date(effectiveDeadline.getTime() + (task.graceMinutes || 30) * 60 * 1000);
    const isLate = now > graceLimit;

    if (isLate && !task.lateSubmissionsAllowed) {
      throw new ValidationError('Task deadline has passed and late submissions are not permitted');
    }

    // Check existing submission
    let submission: any = null;
    for (const s of db.submissions.values()) {
      if (s.taskId === taskId && s.eliteId === eliteId) {
        submission = s;
        break;
      }
    }

    let versionNumber = 1;
    if (submission) {
      if (!task.resubmissionAllowed && submission.status !== SUBMISSION_STATUSES.REVISION_REQUESTED) {
        throw new ValidationError('Resubmission is not permitted for this task');
      }
      versionNumber = submission.currentVersion + 1;
      submission.currentVersion = versionNumber;
      submission.lastSubmittedAt = now;
      submission.status = isLate ? SUBMISSION_STATUSES.LATE_SUBMITTED : (versionNumber > 1 ? SUBMISSION_STATUSES.RESUBMITTED : SUBMISSION_STATUSES.SUBMITTED);
      submission.updatedAt = now;
    } else {
      const submissionId = uuidv4();
      submission = {
        id: submissionId,
        taskId,
        eliteId,
        assignmentId: assignment.id,
        currentVersion: 1,
        status: isLate ? SUBMISSION_STATUSES.LATE_SUBMITTED : SUBMISSION_STATUSES.SUBMITTED,
        firstSubmittedAt: now,
        lastSubmittedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      db.submissions.set(submissionId, submission);
    }

    // Create immutable submission version
    const versionId = uuidv4();
    const receiptReference = TokenSecurity.generateReceiptReference('SUB');

    const submissionVersion = {
      id: versionId,
      submissionId: submission.id,
      versionNumber,
      submittedAt: now,
      isLate,
      textResponse: dto.textResponse || null,
      filesJson: dto.files || [],
      linksJson: dto.links || [],
      receiptReference,
    };
    db.submissionVersions.set(versionId, submissionVersion);

    // Update assignment status
    assignment.status = submission.status;

    // Send immediate acknowledgement notification:
    // IMPORTANT: Submission confirmation is not grading confirmation.
    const notifId = uuidv4();
    db.notifications.set(notifId, {
      id: notifId,
      userId: eliteId,
      eventType: 'SUBMISSION_RECEIVED',
      title: `Submission Received: ${task.title}`,
      message: `Your submission (Version ${versionNumber}) has been securely recorded. Confirmation receipt reference: ${receiptReference}. Our evaluation team will review your work according to the rubric criteria.`,
      dataJson: { taskId, submissionId: submission.id, receiptReference, versionNumber },
      channel: 'IN_APP',
      deliveryStatus: 'DELIVERED',
      isRead: false,
      createdAt: now,
    });

    db.recordAuditLog({
      actorId: eliteId,
      actorRole: ROLES.ELITE,
      action: 'TASK_SUBMITTED',
      entity: 'SubmissionVersion',
      entityId: versionId,
      newState: { taskId, versionNumber, receiptReference, isLate },
      reason: 'Elite confirmed task submission',
    });

    return {
      submissionId: submission.id,
      versionNumber,
      status: submission.status,
      receiptReference,
      submittedAt: now,
      isLate,
      confirmationMessage: 'Your submission has been securely received and recorded. Grading is pending review.',
    };
  }

  async getSubmissions(filter: { taskId?: string; eliteId?: string; status?: string }, user: any) {
    let all = Array.from(db.submissions.values());

    if (user.role === ROLES.ELITE) {
      all = all.filter((s) => s.eliteId === user.id);
    } else if (filter.eliteId) {
      all = all.filter((s) => s.eliteId === filter.eliteId);
    }

    if (filter.taskId) {
      all = all.filter((s) => s.taskId === filter.taskId);
    }
    if (filter.status) {
      all = all.filter((s) => s.status === filter.status);
    }

    return all.map((s) => {
      const task = db.tasks.get(s.taskId);
      const elite = db.users.get(s.eliteId);
      const profile = db.userProfiles.get(s.eliteId);
      
      // Get latest version
      let latestVersion = null;
      for (const v of db.submissionVersions.values()) {
        if (v.submissionId === s.id && v.versionNumber === s.currentVersion) {
          latestVersion = v;
          break;
        }
      }

      // Check evaluation
      let evaluation = null;
      for (const ev of db.evaluations.values()) {
        if (ev.submissionId === s.id && (user.role !== ROLES.ELITE || ev.isPublished)) {
          evaluation = ev;
          break;
        }
      }

      return {
        ...s,
        taskTitle: task?.title,
        taskCode: task?.taskCode,
        maxXP: task?.maxXP,
        eliteName: profile?.fullName || elite?.email,
        eliteIdCode: profile?.eliteId,
        latestVersion,
        evaluation: evaluation ? {
          id: evaluation.id,
          totalScore: evaluation.totalScore,
          xpAwarded: evaluation.xpAwarded,
          isPublished: evaluation.isPublished,
          generalFeedback: evaluation.generalFeedback,
        } : null,
      };
    });
  }

  async getSubmissionById(submissionId: string, user: any) {
    const submission = db.submissions.get(submissionId);
    if (!submission) throw new NotFoundError('Submission not found');

    if (user.role === ROLES.ELITE && submission.eliteId !== user.id) {
      throw new ForbiddenError('Unauthorized access to submission record');
    }

    const task = db.tasks.get(submission.taskId);
    const eliteProfile = db.userProfiles.get(submission.eliteId);

    // Versions
    const versions = [];
    for (const v of db.submissionVersions.values()) {
      if (v.submissionId === submissionId) {
        versions.push(v);
      }
    }
    versions.sort((a, b) => b.versionNumber - a.versionNumber);

    // Evaluations
    const evaluations = [];
    for (const ev of db.evaluations.values()) {
      if (ev.submissionId === submissionId) {
        if (user.role !== ROLES.ELITE || ev.isPublished) {
          const scores = [];
          for (const sc of db.evaluationCriteriaScores.values()) {
            if (sc.evaluationId === ev.id) scores.push(sc);
          }
          evaluations.push({ ...ev, criteriaScores: scores });
        }
      }
    }

    return {
      ...submission,
      task,
      elite: {
        id: submission.eliteId,
        fullName: eliteProfile?.fullName,
        eliteId: eliteProfile?.eliteId,
      },
      versions,
      evaluations,
    };
  }
}

export const submissionsService = new SubmissionsService();
