import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { NotFoundError } from '../../shared/errors.js';
import { ROLES } from '../../config/constants.js';

export class CrmService {
  async getEliteTimeline(eliteId: string) {
    const elite = db.users.get(eliteId);
    if (!elite || elite.role !== ROLES.ELITE) throw new NotFoundError('Elite user not found');

    const profile = db.userProfiles.get(eliteId);

    // Timeline events
    const timelineEvents: any[] = [];

    // 1. Enrollment
    timelineEvents.push({
      type: 'ENROLLMENT',
      title: 'Program Enrollment',
      description: `Enrolled into Thread Elite Program with Elite ID ${profile?.eliteId || 'Pending'}`,
      timestamp: profile?.programStartDate || elite.createdAt,
    });

    // 2. Promotions
    for (const h of db.promotionHistory.values()) {
      if (h.eliteId === eliteId) {
        timelineEvents.push({
          type: 'PROMOTION',
          title: `Promoted: ${h.toLevelName}`,
          description: `Advanced from ${h.fromLevelName} to ${h.toLevelName}. Reason: ${h.reason}`,
          timestamp: h.timestamp,
        });
      }
    }

    // 3. Submissions
    for (const sub of db.submissions.values()) {
      if (sub.eliteId === eliteId) {
        const task = db.tasks.get(sub.taskId);
        timelineEvents.push({
          type: 'SUBMISSION',
          title: `Submitted Task: ${task?.title || 'Task'}`,
          description: `Version ${sub.currentVersion} recorded with status ${sub.status}`,
          timestamp: sub.lastSubmittedAt,
        });
      }
    }

    // 4. Evaluations & XP
    for (const tx of db.xpTransactions.values()) {
      if (tx.eliteId === eliteId) {
        timelineEvents.push({
          type: 'XP_TRANSACTION',
          title: `XP Ledger: ${tx.amount >= 0 ? '+' : ''}${tx.amount} XP`,
          description: `${tx.reason} (${tx.transactionType})`,
          timestamp: tx.timestamp,
        });
      }
    }

    // 5. Notes & Observations
    for (const n of db.crmNotes.values()) {
      if (n.eliteId === eliteId) {
        timelineEvents.push({
          type: 'ADMIN_NOTE',
          title: `Note: ${n.category}`,
          description: n.note,
          timestamp: n.createdAt,
        });
      }
    }

    // Sort timeline chronologically (latest first)
    timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Current status overview
    const xpAcct = db.xpAccounts.get(eliteId);
    let currentLevel = null;
    for (const mem of db.eliteLevelMemberships.values()) {
      if (mem.eliteId === eliteId && mem.isCurrent) {
        currentLevel = db.promotionLevels.get(mem.promotionLevelId);
        break;
      }
    }

    return {
      elite: {
        id: elite.id,
        fullName: profile?.fullName,
        email: elite.email,
        eliteId: profile?.eliteId,
        phone: profile?.phone,
        status: elite.status,
        enrollmentStatus: profile?.enrollmentStatus,
        programStartDate: profile?.programStartDate,
        programEndDate: profile?.programEndDate,
        currentLevel: currentLevel ? { name: currentLevel.name, slug: currentLevel.slug } : null,
        xpBalance: xpAcct?.currentBalance || 0,
      },
      timeline: timelineEvents,
    };
  }

  async addNote(eliteId: string, category: string, note: string, isConfidential: boolean, author: any) {
    const elite = db.users.get(eliteId);
    if (!elite) throw new NotFoundError('Elite not found');

    const noteId = uuidv4();
    const newNote = {
      id: noteId,
      eliteId,
      authorId: author.id,
      category,
      note,
      isConfidential: isConfidential ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.crmNotes.set(noteId, newNote);

    db.recordAuditLog({
      actorId: author.id,
      actorEmail: author.email,
      actorRole: author.role,
      action: 'CRM_NOTE_ADDED',
      entity: 'CRMNote',
      entityId: noteId,
      reason: `Category: ${category}`,
    });

    return newNote;
  }
}

export const crmService = new CrmService();
