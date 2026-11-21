import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors.js';
import { ROLES } from '../../config/constants.js';

export class PromotionsService {
  async getPromotionLevels() {
    const levels = Array.from(db.promotionLevels.values());
    levels.sort((a, b) => a.levelOrder - b.levelOrder);

    // Compute active member count in each level
    const counts: Record<string, number> = {};
    for (const mem of db.eliteLevelMemberships.values()) {
      if (mem.isCurrent) {
        counts[mem.promotionLevelId] = (counts[mem.promotionLevelId] || 0) + 1;
      }
    }

    return levels.map((lvl) => ({
      ...lvl,
      activeMembersCount: counts[lvl.id] || 0,
    }));
  }

  async getPromotionLevelById(levelId: string) {
    const level = db.promotionLevels.get(levelId);
    if (!level) throw new NotFoundError('Promotion level not found');
    return level;
  }

  async updatePromotionLevel(levelId: string, updates: Partial<{ name: string; description: string; requiredXP: number; colorHex: string; badgeUrl: string }>, actor: any) {
    const level = db.promotionLevels.get(levelId);
    if (!level) throw new NotFoundError('Promotion level not found');

    const previousState = { ...level };
    Object.assign(level, updates, { updatedAt: new Date() });

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'PROMOTION_LEVEL_UPDATED',
      entity: 'PromotionLevel',
      entityId: levelId,
      previousState,
      newState: level,
      reason: 'Administrator updated promotion level configuration',
    });

    return level;
  }

  /**
   * Transactional Promotion of an Elite
   */
  async promoteElite(eliteId: string, targetLevelId: string, reason: string, notes: string | undefined, actor: any) {
    const elite = db.users.get(eliteId);
    if (!elite || elite.role !== ROLES.ELITE) {
      throw new NotFoundError('Elite user record not found');
    }

    const targetLevel = db.promotionLevels.get(targetLevelId);
    if (!targetLevel) {
      throw new NotFoundError('Target promotion level does not exist');
    }

    // Find current active membership
    let currentMembership: any = null;
    let currentLevel: any = null;
    for (const mem of db.eliteLevelMemberships.values()) {
      if (mem.eliteId === eliteId && mem.isCurrent) {
        currentMembership = mem;
        currentLevel = db.promotionLevels.get(mem.promotionLevelId);
        break;
      }
    }

    if (currentMembership && currentMembership.promotionLevelId === targetLevelId) {
      throw new ValidationError(`Elite is already in level ${targetLevel.name}`);
    }

    // Begin transactional progression
    const result = await db.transaction(async (store) => {
      const now = new Date();

      // 1. Deactivate prior membership
      if (currentMembership) {
        currentMembership.isCurrent = false;
        currentMembership.effectiveTo = now;
      }

      // 2. Create new level membership
      const newMembershipId = uuidv4();
      const newMembership = {
        id: newMembershipId,
        eliteId,
        promotionLevelId: targetLevelId,
        isCurrent: true,
        effectiveFrom: now,
        promotedById: actor.id,
        createdAt: now,
      };
      store.eliteLevelMemberships.set(newMembershipId, newMembership);

      // 3. Record immutable promotion history
      const historyId = uuidv4();
      const historyRecord = {
        id: historyId,
        eliteId,
        fromLevelId: currentLevel?.id || null,
        fromLevelName: currentLevel?.name || 'Unassigned',
        toLevelId: targetLevel.id,
        toLevelName: targetLevel.name,
        promotedById: actor.id,
        promoterName: actor.fullName,
        reason,
        notes: notes || null,
        timestamp: now,
      };
      store.promotionHistory.set(historyId, historyRecord);

      // 4. Create Notification for the Elite
      const notificationId = uuidv4();
      store.notifications.set(notificationId, {
        id: notificationId,
        userId: eliteId,
        eventType: 'PROMOTION_APPROVED',
        title: `Congratulations! Promoted to ${targetLevel.name}`,
        message: `You have successfully advanced from ${currentLevel?.name || 'Foundation'} to ${targetLevel.name}! Access your new dashboard to explore advanced tasks and resources.`,
        dataJson: { fromLevel: currentLevel?.name, toLevel: targetLevel.name, reason },
        channel: 'IN_APP',
        deliveryStatus: 'DELIVERED',
        isRead: false,
        createdAt: now,
      });

      // 5. Audit Log
      store.recordAuditLog({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: 'ELITE_PROMOTED',
        entity: 'PromotionHistory',
        entityId: historyId,
        previousState: { level: currentLevel?.name },
        newState: { level: targetLevel.name, levelOrder: targetLevel.levelOrder },
        reason,
      });

      return historyRecord;
    });

    return {
      success: true,
      eliteId,
      previousLevel: result.fromLevelName,
      newLevel: result.toLevelName,
      historyId: result.id,
      timestamp: result.timestamp,
    };
  }

  async getPromotionHistory(eliteId: string) {
    const elite = db.users.get(eliteId);
    if (!elite) throw new NotFoundError('Elite not found');

    const history = [];
    for (const h of db.promotionHistory.values()) {
      if (h.eliteId === eliteId) {
        history.push(h);
      }
    }
    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return history;
  }
}

export const promotionsService = new PromotionsService();
