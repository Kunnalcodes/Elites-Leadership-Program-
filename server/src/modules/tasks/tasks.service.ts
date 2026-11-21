import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors.js';
import { TASK_STATUSES, TASK_FORMATS, ROLES, SUBMISSION_STATUSES } from '../../config/constants.js';

export interface CreateTaskDto {
  title: string;
  shortDescription: string;
  instructions: string;
  objectives?: string[];
  category: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  taskFormat: string[];
  maxXP: number;
  submissionDeadline: string; // ISO string
  timezone?: string;
  resubmissionAllowed?: boolean;
  maxResubmissions?: number;
  lateSubmissionsAllowed?: boolean;
  latePenaltyPercent?: number;
  graceMinutes?: number;
  targetType: 'ALL' | 'PROMOTION_LEVEL' | 'INDIVIDUAL' | 'COHORT';
  targetValue: string; // Level ID, Cohort ID, User ID or "*"
  resources?: { title: string; url: string; resourceType: string; isRequired?: boolean }[];
  rubricCriteria?: { title: string; description?: string; maxScore: number; weight?: number }[];
}

export class TasksService {
  async createTask(dto: CreateTaskDto, actor: any) {
    const taskId = uuidv4();
    const count = db.tasks.size + 1;
    const taskCode = `TASK-SEC-${String(count).padStart(3, '0')}`;

    const task = {
      id: taskId,
      taskCode,
      title: dto.title,
      shortDescription: dto.shortDescription,
      instructions: dto.instructions,
      objectives: dto.objectives || [],
      category: dto.category,
      difficulty: dto.difficulty || 'BEGINNER',
      taskFormat: dto.taskFormat,
      status: TASK_STATUSES.DRAFT,
      maxXP: dto.maxXP || 100,
      submissionDeadline: new Date(dto.submissionDeadline),
      timezone: dto.timezone || 'UTC',
      resubmissionAllowed: dto.resubmissionAllowed ?? true,
      maxResubmissions: dto.maxResubmissions ?? 3,
      lateSubmissionsAllowed: dto.lateSubmissionsAllowed ?? true,
      latePenaltyPercent: dto.latePenaltyPercent ?? 10,
      graceMinutes: dto.graceMinutes ?? 30,
      authorId: actor.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.tasks.set(taskId, task);

    // Target
    const targetId = uuidv4();
    db.taskTargets.set(targetId, {
      id: targetId,
      taskId,
      targetType: dto.targetType,
      targetValue: dto.targetValue,
      createdAt: new Date(),
    });

    // Resources
    if (dto.resources && dto.resources.length > 0) {
      for (const res of dto.resources) {
        const resId = uuidv4();
        db.taskResources.set(resId, {
          id: resId,
          taskId,
          title: res.title,
          url: res.url,
          resourceType: res.resourceType,
          isRequired: res.isRequired ?? false,
          createdAt: new Date(),
        });
      }
    }

    // Rubric
    const rubricId = uuidv4();
    const rubric = {
      id: rubricId,
      taskId,
      name: `${dto.title} Rubric`,
      totalMaxScore: dto.maxXP || 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.taskRubrics.set(rubricId, rubric);

    if (dto.rubricCriteria && dto.rubricCriteria.length > 0) {
      for (const crit of dto.rubricCriteria) {
        const critId = uuidv4();
        db.taskRubricCriteria.set(critId, {
          id: critId,
          rubricId,
          title: crit.title,
          description: crit.description || '',
          maxScore: crit.maxScore,
          weight: crit.weight || 1.0,
          createdAt: new Date(),
        });
      }
    } else {
      // Default 4 standard criteria
      const standardCriteria = [
        { title: 'Technical Accuracy & Execution', maxScore: 40 },
        { title: 'Research Quality & Depth', maxScore: 30 },
        { title: 'Clarity, Formatting & Presentation', maxScore: 20 },
        { title: 'Timeliness & Completeness', maxScore: 10 },
      ];
      for (const crit of standardCriteria) {
        const critId = uuidv4();
        db.taskRubricCriteria.set(critId, {
          id: critId,
          rubricId,
          title: crit.title,
          description: '',
          maxScore: crit.maxScore,
          weight: 1.0,
          createdAt: new Date(),
        });
      }
    }

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'TASK_CREATED',
      entity: 'Task',
      entityId: taskId,
      newState: { taskCode, title: dto.title, maxXP: dto.maxXP, targetType: dto.targetType },
      reason: 'Task Master created new task blueprint',
    });

    return this.getTaskById(taskId, actor);
  }

  async publishTask(taskId: string, actor: any) {
    const task = db.tasks.get(taskId);
    if (!task) throw new NotFoundError('Task not found');

    if (task.status === TASK_STATUSES.PUBLISHED || task.status === TASK_STATUSES.ACTIVE) {
      return this.getTaskById(taskId, actor);
    }

    task.status = TASK_STATUSES.PUBLISHED;
    task.updatedAt = new Date();

    // Distribute task assignments to targeted elites
    let targets: any[] = [];
    for (const t of db.taskTargets.values()) {
      if (t.taskId === taskId) targets.push(t);
    }

    const assignedEliteIds: string[] = [];
    for (const user of db.users.values()) {
      if (user.role === ROLES.ELITE && user.status === 'ACTIVE') {
        let isEligible = false;

        for (const target of targets) {
          if (target.targetType === 'ALL') {
            isEligible = true;
          } else if (target.targetType === 'PROMOTION_LEVEL') {
            // Check elite level membership
            for (const mem of db.eliteLevelMemberships.values()) {
              if (mem.eliteId === user.id && mem.isCurrent && mem.promotionLevelId === target.targetValue) {
                isEligible = true;
                break;
              }
            }
          } else if (target.targetType === 'INDIVIDUAL') {
            if (target.targetValue === user.id) isEligible = true;
          }
        }

        if (isEligible) {
          // Check if already assigned
          let existingAssign = false;
          for (const a of db.taskAssignments.values()) {
            if (a.taskId === taskId && a.eliteId === user.id) {
              existingAssign = true;
              break;
            }
          }

          if (!existingAssign) {
            const assignId = uuidv4();
            db.taskAssignments.set(assignId, {
              id: assignId,
              taskId,
              eliteId: user.id,
              status: SUBMISSION_STATUSES.NOT_STARTED,
              assignedAt: new Date(),
            });
            assignedEliteIds.push(user.id);

            // Send notification to Elite
            const notifId = uuidv4();
            db.notifications.set(notifId, {
              id: notifId,
              userId: user.id,
              eventType: 'NEW_TASK_ASSIGNED',
              title: `New Task Assigned: ${task.title}`,
              message: `You have been assigned a new task: "${task.title}". Worth up to ${task.maxXP} XP. Deadline: ${task.submissionDeadline.toLocaleDateString()}.`,
              dataJson: { taskId, maxXP: task.maxXP },
              channel: 'IN_APP',
              deliveryStatus: 'DELIVERED',
              isRead: false,
              createdAt: new Date(),
            });
          }
        }
      }
    }

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'TASK_PUBLISHED',
      entity: 'Task',
      entityId: taskId,
      newState: { status: task.status, assignedCount: assignedEliteIds.length },
      reason: 'Task published and distributed to eligible Elites',
    });

    return {
      taskId,
      status: task.status,
      assignedCount: assignedEliteIds.length,
    };
  }

  async getTasks(filter: { status?: string; category?: string; promotionLevelId?: string }, user: any) {
    let allTasks = Array.from(db.tasks.values());

    if (filter.status) {
      allTasks = allTasks.filter((t) => t.status === filter.status);
    }
    if (filter.category) {
      allTasks = allTasks.filter((t) => t.category === filter.category);
    }

    // Role-based visibility scoping
    if (user.role === ROLES.ELITE) {
      // Elite only sees tasks that are PUBLISHED/ACTIVE and assigned to them
      const myAssignments = new Map<string, any>();
      for (const a of db.taskAssignments.values()) {
        if (a.eliteId === user.id) {
          myAssignments.set(a.taskId, a);
        }
      }

      allTasks = allTasks.filter((t) => {
        const isPublished = t.status === TASK_STATUSES.PUBLISHED || t.status === TASK_STATUSES.ACTIVE || t.status === TASK_STATUSES.COMPLETED;
        return isPublished && myAssignments.has(t.id);
      });

      return allTasks.map((t) => {
        const assignment = myAssignments.get(t.id);
        return {
          ...t,
          assignmentStatus: assignment?.status || 'NOT_STARTED',
        };
      });
    }

    return allTasks;
  }

  async getTaskById(taskId: string, user: any) {
    const task = db.tasks.get(taskId);
    if (!task) throw new NotFoundError('Task not found');

    // Resources
    const resources = [];
    for (const r of db.taskResources.values()) {
      if (r.taskId === taskId) resources.push(r);
    }

    // Rubric
    let rubric = null;
    for (const rub of db.taskRubrics.values()) {
      if (rub.taskId === taskId) {
        const criteria = [];
        for (const crit of db.taskRubricCriteria.values()) {
          if (crit.rubricId === rub.id) criteria.push(crit);
        }
        rubric = { ...rub, criteria };
        break;
      }
    }

    // Targets
    const targets = [];
    for (const tgt of db.taskTargets.values()) {
      if (tgt.taskId === taskId) targets.push(tgt);
    }

    // Submission / Assignment status for current user if Elite
    let myAssignment = null;
    let mySubmission = null;
    if (user.role === ROLES.ELITE) {
      for (const a of db.taskAssignments.values()) {
        if (a.taskId === taskId && a.eliteId === user.id) {
          myAssignment = a;
          break;
        }
      }
      for (const sub of db.submissions.values()) {
        if (sub.taskId === taskId && sub.eliteId === user.id) {
          const versions = [];
          for (const v of db.submissionVersions.values()) {
            if (v.submissionId === sub.id) versions.push(v);
          }
          mySubmission = { ...sub, versions };
          break;
        }
      }
    }

    // Stats for Admins
    let totalAssigned = 0;
    let totalSubmitted = 0;
    let totalGraded = 0;
    for (const a of db.taskAssignments.values()) {
      if (a.taskId === taskId) {
        totalAssigned++;
        if (a.status === 'SUBMITTED' || a.status === 'LATE_SUBMITTED') totalSubmitted++;
        if (a.status === 'GRADED' || a.status === 'RESULT_PUBLISHED') totalGraded++;
      }
    }

    return {
      ...task,
      resources,
      rubric,
      targets,
      myAssignment,
      mySubmission,
      stats: { totalAssigned, totalSubmitted, totalGraded },
    };
  }

  async updateTask(taskId: string, updates: Partial<CreateTaskDto>, actor: any) {
    const task = db.tasks.get(taskId);
    if (!task) throw new NotFoundError('Task not found');

    const previousState = { ...task };
    if (updates.title) task.title = updates.title;
    if (updates.shortDescription) task.shortDescription = updates.shortDescription;
    if (updates.instructions) task.instructions = updates.instructions;
    if (updates.submissionDeadline) task.submissionDeadline = new Date(updates.submissionDeadline);
    if (updates.maxXP !== undefined) task.maxXP = updates.maxXP;
    task.updatedAt = new Date();

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'TASK_UPDATED',
      entity: 'Task',
      entityId: taskId,
      previousState,
      newState: task,
      reason: 'Administrator updated task specifications',
    });

    return this.getTaskById(taskId, actor);
  }

  async reopenTask(taskId: string, extendedDeadline: string, reason: string, actor: any) {
    const task = db.tasks.get(taskId);
    if (!task) throw new NotFoundError('Task not found');

    task.status = TASK_STATUSES.REOPENED;
    task.submissionDeadline = new Date(extendedDeadline);
    task.updatedAt = new Date();

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'TASK_REOPENED',
      entity: 'Task',
      entityId: taskId,
      newState: { status: task.status, newDeadline: task.submissionDeadline },
      reason,
    });

    return { taskId, status: task.status, newDeadline: task.submissionDeadline };
  }

  async cancelTask(taskId: string, reason: string, actor: any) {
    const task = db.tasks.get(taskId);
    if (!task) throw new NotFoundError('Task not found');

    task.status = TASK_STATUSES.CANCELLED;
    task.updatedAt = new Date();

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'TASK_CANCELLED',
      entity: 'Task',
      entityId: taskId,
      reason,
    });

    return { taskId, status: task.status };
  }
}

export const tasksService = new TasksService();
