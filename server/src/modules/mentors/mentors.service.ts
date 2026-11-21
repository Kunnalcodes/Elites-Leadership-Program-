import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { NotFoundError, ConflictError } from '../../shared/errors.js';
import { ROLES } from '../../config/constants.js';

export class MentorsService {
  async getMentors() {
    const mentors = Array.from(db.users.values()).filter(
      (u) => u.role === ROLES.MENTOR && u.status === 'ACTIVE'
    );

    return mentors.map((m) => {
      const profile = db.userProfiles.get(m.id);
      let assignedCount = 0;
      for (const a of db.mentorAssignments.values()) {
        if (a.mentorId === m.id && a.isActive) assignedCount++;
      }

      return {
        id: m.id,
        email: m.email,
        fullName: profile?.fullName || m.email,
        phone: profile?.phone || null,
        avatarUrl: profile?.avatarUrl || null,
        assignedElitesCount: assignedCount,
      };
    });
  }

  async assignMentor(mentorId: string, eliteId: string, actor: any, notes?: string) {
    const mentor = db.users.get(mentorId);
    if (!mentor || mentor.role !== ROLES.MENTOR) throw new NotFoundError('Mentor not found');

    const elite = db.users.get(eliteId);
    if (!elite || elite.role !== ROLES.ELITE) throw new NotFoundError('Elite not found');

    // Deactivate existing assignment
    for (const a of db.mentorAssignments.values()) {
      if (a.eliteId === eliteId && a.isActive) {
        a.isActive = false;
      }
    }

    const assignId = uuidv4();
    const assignment = {
      id: assignId,
      mentorId,
      eliteId,
      assignedById: actor.id,
      assignedAt: new Date(),
      isActive: true,
      notes: notes || null,
    };
    db.mentorAssignments.set(assignId, assignment);

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'MENTOR_ASSIGNED',
      entity: 'MentorAssignment',
      entityId: assignId,
      newState: { mentorId, eliteId },
      reason: 'Administrator assigned mentor to Elite',
    });

    return assignment;
  }

  async getMentorWorkspace(mentorId: string) {
    const assignedElites = [];
    for (const a of db.mentorAssignments.values()) {
      if (a.mentorId === mentorId && a.isActive) {
        const elite = db.users.get(a.eliteId);
        const profile = db.userProfiles.get(a.eliteId);
        const xpAcct = db.xpAccounts.get(a.eliteId);

        // Current level
        let currentLevel = null;
        for (const mem of db.eliteLevelMemberships.values()) {
          if (mem.eliteId === a.eliteId && mem.isCurrent) {
            currentLevel = db.promotionLevels.get(mem.promotionLevelId);
            break;
          }
        }

        // Unanswered queries
        let unreadQueries = 0;
        for (const conv of db.conversations.values()) {
          if (conv.eliteId === a.eliteId && conv.mentorId === mentorId && conv.status === 'WAITING_FOR_MENTOR') {
            unreadQueries++;
          }
        }

        assignedElites.push({
          eliteId: a.eliteId,
          fullName: profile?.fullName || elite?.email,
          eliteIdCode: profile?.eliteId,
          email: elite?.email,
          avatarUrl: profile?.avatarUrl,
          currentLevel: currentLevel ? { name: currentLevel.name, slug: currentLevel.slug } : null,
          xpBalance: xpAcct?.currentBalance || 0,
          unreadQueries,
          assignedAt: a.assignedAt,
        });
      }
    }

    // Pending evaluations
    const pendingEvaluations = [];
    for (const sub of db.submissions.values()) {
      if (sub.status === 'SUBMITTED' || sub.status === 'RESUBMITTED') {
        const isAssigned = assignedElites.some((e) => e.eliteId === sub.eliteId);
        if (isAssigned) {
          const task = db.tasks.get(sub.taskId);
          const eliteProfile = db.userProfiles.get(sub.eliteId);
          pendingEvaluations.push({
            submissionId: sub.id,
            taskId: sub.taskId,
            taskTitle: task?.title,
            eliteName: eliteProfile?.fullName,
            submittedAt: sub.lastSubmittedAt,
            status: sub.status,
          });
        }
      }
    }

    return {
      assignedElites,
      pendingEvaluations,
      stats: {
        totalElites: assignedElites.length,
        pendingReviewCount: pendingEvaluations.length,
      },
    };
  }

  async recordMentoringSession(mentorId: string, eliteId: string, notes: string, actor: any) {
    const noteId = uuidv4();
    const note = {
      id: noteId,
      eliteId,
      authorId: mentorId,
      category: 'MENTORSHIP',
      note,
      isConfidential: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.crmNotes.set(noteId, note);

    return note;
  }
}

export const mentorsService = new MentorsService();
