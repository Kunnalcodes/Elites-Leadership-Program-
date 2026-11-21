import { db } from '../../infrastructure/database/db.js';
import { settingsService } from '../settings/settings.service.js';
import { leaderboardService } from '../leaderboard/leaderboard.service.js';
import { ROLES, TASK_STATUSES, SUBMISSION_STATUSES } from '../../config/constants.js';

export class AnalyticsService {
  async getSuperAdminAnalytics() {
    let totalElites = 0;
    let activeElites = 0;
    let inactiveElites = 0;
    let archivedElites = 0;
    let totalAdmins = 0;
    let totalMentors = 0;

    for (const u of db.users.values()) {
      if (u.role === ROLES.ELITE) {
        totalElites++;
        if (u.status === 'ACTIVE') activeElites++;
        else if (u.status === 'ARCHIVED') archivedElites++;
        else inactiveElites++;
      } else if (u.role === ROLES.ADMIN || u.role === ROLES.SUPER_ADMIN) {
        totalAdmins++;
      } else if (u.role === ROLES.MENTOR) {
        totalMentors++;
      }
    }

    // Elites in each promotion level
    const levelCounts: Record<string, { id: string; name: string; count: number; slug: string }> = {};
    for (const lvl of db.promotionLevels.values()) {
      levelCounts[lvl.id] = { id: lvl.id, name: lvl.name, slug: lvl.slug, count: 0 };
    }
    for (const mem of db.eliteLevelMemberships.values()) {
      if (mem.isCurrent && levelCounts[mem.promotionLevelId]) {
        levelCounts[mem.promotionLevelId].count++;
      }
    }

    // Tasks metrics
    let totalTasks = db.tasks.size;
    let activeTasks = 0;
    let upcomingDeadlines = [];
    const now = new Date();

    for (const t of db.tasks.values()) {
      if (t.status === TASK_STATUSES.PUBLISHED || t.status === TASK_STATUSES.ACTIVE) {
        activeTasks++;
        if (new Date(t.submissionDeadline) > now) {
          upcomingDeadlines.push({
            id: t.id,
            title: t.title,
            deadline: t.submissionDeadline,
            maxXP: t.maxXP,
          });
        }
      }
    }
    upcomingDeadlines.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    // Evaluations
    let pendingEvaluations = 0;
    let completedEvaluations = 0;
    for (const sub of db.submissions.values()) {
      if (sub.status === SUBMISSION_STATUSES.SUBMITTED || sub.status === SUBMISSION_STATUSES.LATE_SUBMITTED || sub.status === SUBMISSION_STATUSES.RESUBMITTED) {
        pendingEvaluations++;
      } else if (sub.status === SUBMISSION_STATUSES.GRADED || sub.status === SUBMISSION_STATUSES.RESULT_PUBLISHED) {
        completedEvaluations++;
      }
    }

    // Total XP distributed
    let totalXpDistributed = 0;
    for (const tx of db.xpTransactions.values()) {
      if (!tx.isReversed) {
        totalXpDistributed += tx.amount;
      }
    }

    // Current top three
    const topThree = await leaderboardService.getTopThree();

    // Recent administrative activities
    const recentActivities = Array.from(db.auditLogs.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    // Integrations health
    const integrations = await settingsService.getIntegrationRegistry();

    return {
      users: {
        totalElites,
        activeElites,
        inactiveElites,
        archivedElites,
        totalAdmins,
        totalMentors,
      },
      promotionLevels: Object.values(levelCounts),
      tasks: {
        totalTasks,
        activeTasks,
        pendingEvaluations,
        completedEvaluations,
        upcomingDeadlines: upcomingDeadlines.slice(0, 5),
      },
      xp: {
        totalDistributed: totalXpDistributed,
      },
      topThree: topThree.topThree,
      recentActivities,
      integrations,
    };
  }

  async getAdminAnalytics(adminUser: any) {
    let tasksCreated = 0;
    let activeTasks = 0;
    for (const t of db.tasks.values()) {
      tasksCreated++;
      if (t.status === TASK_STATUSES.PUBLISHED || t.status === TASK_STATUSES.ACTIVE) {
        activeTasks++;
      }
    }

    let pendingSubmissions = 0;
    let pendingGrading = 0;
    for (const sub of db.submissions.values()) {
      if (sub.status === 'SUBMITTED' || sub.status === 'RESUBMITTED') {
        pendingGrading++;
      }
    }

    for (const a of db.taskAssignments.values()) {
      if (a.status === 'NOT_STARTED' || a.status === 'IN_PROGRESS') {
        pendingSubmissions++;
      }
    }

    const announcementsCount = db.announcements.size;

    return {
      tasksCreated,
      activeTasks,
      pendingSubmissions,
      pendingGrading,
      announcementsCount,
    };
  }

  async getEliteAnalytics(eliteUser: any) {
    const xpAcct = db.xpAccounts.get(eliteUser.id);
    const personalXP = xpAcct?.currentBalance || 0;

    // Leaderboard ranking
    const overall = await leaderboardService.getLiveLeaderboard('OVERALL');
    const myEntry = overall.find((e) => e.eliteId === eliteUser.id);
    const currentRank = myEntry ? myEntry.rank : overall.length + 1;

    // Current level
    let currentLevel = null;
    for (const mem of db.eliteLevelMemberships.values()) {
      if (mem.eliteId === eliteUser.id && mem.isCurrent) {
        currentLevel = db.promotionLevels.get(mem.promotionLevelId);
        break;
      }
    }

    // Tasks summary
    let assignedCount = 0;
    let completedCount = 0;
    let pendingCount = 0;
    const upcomingDeadlines = [];
    const now = new Date();

    for (const a of db.taskAssignments.values()) {
      if (a.eliteId === eliteUser.id) {
        assignedCount++;
        if (a.status === 'GRADED' || a.status === 'RESULT_PUBLISHED') {
          completedCount++;
        } else {
          pendingCount++;
          const task = db.tasks.get(a.taskId);
          if (task && new Date(task.submissionDeadline) > now) {
            upcomingDeadlines.push({
              taskId: task.id,
              title: task.title,
              deadline: task.submissionDeadline,
              maxXP: task.maxXP,
            });
          }
        }
      }
    }

    // Milestones
    const milestones = [
      { id: 'm1', title: 'Cohort Orientation & Onboarding', completed: true },
      { id: 'm2', title: 'Foundational Threat Modeling', completed: completedCount >= 1 },
      { id: 'm3', title: 'Security Architecture Assessment', completed: completedCount >= 3 },
      { id: 'm4', title: 'Mentorship Sprint I', completed: completedCount >= 5 },
      { id: 'm5', title: 'Mid-Year Capstone Defense', completed: personalXP >= 1500 },
    ];

    return {
      personalXP,
      currentRank,
      totalParticipants: overall.length,
      currentLevel: currentLevel ? { id: currentLevel.id, name: currentLevel.name, slug: currentLevel.slug, requiredXP: currentLevel.requiredXP } : null,
      tasks: {
        assigned: assignedCount,
        completed: completedCount,
        pending: pendingCount,
        upcomingDeadlines: upcomingDeadlines.slice(0, 5),
      },
      milestones,
    };
  }

  /**
   * Scoped data contract for the 5 distinct promotion dashboards
   */
  async getPromotionLevelAnalytics(levelIdOrSlug: string, user: any) {
    let level = db.promotionLevels.get(levelIdOrSlug);
    if (!level) {
      for (const l of db.promotionLevels.values()) {
        if (l.slug === levelIdOrSlug) {
          level = l;
          break;
        }
      }
    }
    if (!level) return null;

    // Members in this level
    const members = [];
    for (const mem of db.eliteLevelMemberships.values()) {
      if (mem.promotionLevelId === level.id && mem.isCurrent) {
        const elite = db.users.get(mem.eliteId);
        const profile = db.userProfiles.get(mem.eliteId);
        const xpAcct = db.xpAccounts.get(mem.eliteId);
        members.push({
          id: mem.eliteId,
          fullName: profile?.fullName || elite?.email,
          eliteIdCode: profile?.eliteId,
          xpBalance: xpAcct?.currentBalance || 0,
        });
      }
    }

    // Level-specific leaderboard
    const levelLeaderboard = await leaderboardService.getLiveLeaderboard('PROMOTION_LEVEL', level.id);

    // Level-specific announcements
    const levelAnnouncements = [];
    for (const a of db.announcements.values()) {
      if (a.status === 'PUBLISHED' && (a.audienceType === 'ALL' || (a.audienceType === 'PROMOTION_LEVEL' && a.audienceValue === level.id))) {
        levelAnnouncements.push(a);
      }
    }

    return {
      level: {
        id: level.id,
        levelOrder: level.levelOrder,
        name: level.name,
        slug: level.slug,
        description: level.description,
        requiredXP: level.requiredXP,
        colorHex: level.colorHex,
      },
      memberCount: members.length,
      members: members.slice(0, 20),
      topThree: levelLeaderboard.slice(0, 3),
      leaderboard: levelLeaderboard.slice(0, 10),
      announcements: levelAnnouncements.slice(0, 5),
    };
  }
}

export const analyticsService = new AnalyticsService();
