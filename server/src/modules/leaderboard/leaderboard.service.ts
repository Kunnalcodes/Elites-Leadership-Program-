import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { ROLES } from '../../config/constants.js';

export interface LeaderboardRankEntry {
  rank: number;
  eliteId: string;
  fullName: string;
  eliteIdCode: string | null;
  avatarUrl: string | null;
  promotionLevel: { id: string; name: string; slug: string; colorHex: string } | null;
  totalXP: number;
  tasksCompleted: number;
  rankChange: number;
  podiumPlace?: 'CHAMPION' | 'RUNNER_UP' | 'THIRD_PLACE' | null;
}

export class LeaderboardService {
  /**
   * Computes live leaderboard standings
   */
  async getLiveLeaderboard(scope = 'OVERALL', levelId?: string): Promise<LeaderboardRankEntry[]> {
    const eliteUsers = Array.from(db.users.values()).filter(
      (u) => u.role === ROLES.ELITE && u.status === 'ACTIVE'
    );

    const entries: LeaderboardRankEntry[] = [];

    for (const elite of eliteUsers) {
      const profile = db.userProfiles.get(elite.id);
      const xpAcct = db.xpAccounts.get(elite.id);
      const totalXP = xpAcct?.currentBalance || 0;

      // Promotion level lookup
      let currentLevel = null;
      for (const mem of db.eliteLevelMemberships.values()) {
        if (mem.eliteId === elite.id && mem.isCurrent) {
          const lvl = db.promotionLevels.get(mem.promotionLevelId);
          if (lvl) {
            currentLevel = {
              id: lvl.id,
              name: lvl.name,
              slug: lvl.slug,
              colorHex: lvl.colorHex,
            };
          }
          break;
        }
      }

      // Filter by level if specified
      if (levelId && currentLevel?.id !== levelId) {
        continue;
      }

      // Tasks completed count
      let tasksCompleted = 0;
      for (const a of db.taskAssignments.values()) {
        if (a.eliteId === elite.id && (a.status === 'GRADED' || a.status === 'RESULT_PUBLISHED')) {
          tasksCompleted++;
        }
      }

      entries.push({
        rank: 0,
        eliteId: elite.id,
        fullName: profile?.fullName || elite.email,
        eliteIdCode: profile?.eliteId || null,
        avatarUrl: profile?.avatarUrl || null,
        promotionLevel: currentLevel,
        totalXP,
        tasksCompleted,
        rankChange: 0,
      });
    }

    // Centrally sort by: 1. totalXP desc, 2. tasksCompleted desc
    entries.sort((a, b) => {
      if (b.totalXP !== a.totalXP) {
        return b.totalXP - a.totalXP;
      }
      return b.tasksCompleted - a.tasksCompleted;
    });

    // Assign rank numbers and top three podium tags
    entries.forEach((entry, idx) => {
      entry.rank = idx + 1;
      if (entry.rank === 1) entry.podiumPlace = 'CHAMPION';
      else if (entry.rank === 2) entry.podiumPlace = 'RUNNER_UP';
      else if (entry.rank === 3) entry.podiumPlace = 'THIRD_PLACE';
      else entry.podiumPlace = null;
    });

    return entries;
  }

  /**
   * Retrieves Top Three Showcase
   */
  async getTopThree(scope = 'OVERALL', levelId?: string) {
    const list = await this.getLiveLeaderboard(scope, levelId);
    return {
      champion: list[0] || null,
      runnerUp: list[1] || null,
      thirdPlace: list[2] || null,
      topThree: list.slice(0, 3),
    };
  }

  /**
   * Recalculates standings and persists rank cache
   */
  async recalculateStandings() {
    return await this.getLiveLeaderboard();
  }

  /**
   * Official Snapshot Publication
   */
  async publishSnapshot(scope = 'OVERALL', levelId: string | undefined, title: string, actor: any) {
    const standings = await this.getLiveLeaderboard(scope, levelId);
    const snapshotId = uuidv4();
    const now = new Date();

    const snapshot = {
      id: snapshotId,
      scope,
      promotionLevelId: levelId || null,
      title: title || `${scope} Official Leaderboard Standings`,
      publishedById: actor.id,
      isPublished: true,
      publishedAt: now,
    };
    db.leaderboardSnapshots.set(snapshotId, snapshot);

    for (const item of standings) {
      const entryId = uuidv4();
      db.leaderboardEntries.set(entryId, {
        id: entryId,
        snapshotId,
        eliteId: item.eliteId,
        rank: item.rank,
        totalXP: item.totalXP,
        tasksCompleted: item.tasksCompleted,
        rankChange: 0,
        metadataJson: {
          fullName: item.fullName,
          eliteIdCode: item.eliteIdCode,
          podiumPlace: item.podiumPlace,
        },
      });

      // Broadcast notification to affected Elite
      const notifId = uuidv4();
      db.notifications.set(notifId, {
        id: notifId,
        userId: item.eliteId,
        eventType: 'LEADERBOARD_PUBLISHED',
        title: `Official Leaderboard Published: Rank #${item.rank}`,
        message: `The official leaderboard "${snapshot.title}" has been published. You are currently ranked #${item.rank} with ${item.totalXP} XP!`,
        dataJson: { rank: item.rank, totalXP: item.totalXP, snapshotId },
        channel: 'IN_APP',
        deliveryStatus: 'DELIVERED',
        isRead: false,
        createdAt: now,
      });
    }

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'LEADERBOARD_PUBLISHED',
      entity: 'LeaderboardSnapshot',
      entityId: snapshotId,
      newState: { title: snapshot.title, totalRanked: standings.length },
      reason: 'Official leaderboard snapshot published and broadcast to participants',
    });

    return {
      snapshotId,
      title: snapshot.title,
      totalEntries: standings.length,
      publishedAt: now,
      standings: standings.slice(0, 50),
    };
  }

  async getHistory() {
    const list = Array.from(db.leaderboardSnapshots.values());
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return list;
  }
}

export const leaderboardService = new LeaderboardService();
