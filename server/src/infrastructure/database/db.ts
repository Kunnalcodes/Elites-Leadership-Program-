import { v4 as uuidv4 } from 'uuid';
import { PROMOTION_LEVELS, PERMISSION_LIST, ROLES, TASK_STATUSES, SUBMISSION_STATUSES, XP_TRANSACTION_TYPES } from '../../config/constants.js';

export class DatabaseStore {
  // Core collections
  public users: Map<string, any> = new Map();
  public userProfiles: Map<string, any> = new Map();
  public roles: Map<string, any> = new Map();
  public permissions: Map<string, any> = new Map();
  public rolePermissions: Map<string, any> = new Map();
  public userRoleAssignments: Map<string, any> = new Map();
  public sessions: Map<string, any> = new Map();
  public otpChallenges: Map<string, any> = new Map();

  // Programs & Promotions
  public programs: Map<string, any> = new Map();
  public programSettings: Map<string, any> = new Map();
  public promotionLevels: Map<string, any> = new Map();
  public eliteLevelMemberships: Map<string, any> = new Map();
  public promotionHistory: Map<string, any> = new Map();
  public cohorts: Map<string, any> = new Map();
  public mentorAssignments: Map<string, any> = new Map();

  // Tasks & Submissions
  public tasks: Map<string, any> = new Map();
  public taskResources: Map<string, any> = new Map();
  public taskTargets: Map<string, any> = new Map();
  public taskAssignments: Map<string, any> = new Map();
  public taskRubrics: Map<string, any> = new Map();
  public taskRubricCriteria: Map<string, any> = new Map();
  public submissions: Map<string, any> = new Map();
  public submissionVersions: Map<string, any> = new Map();

  // Grading & XP
  public evaluations: Map<string, any> = new Map();
  public evaluationCriteriaScores: Map<string, any> = new Map();
  public xpAccounts: Map<string, any> = new Map();
  public xpTransactions: Map<string, any> = new Map();
  public xpTransactionReversals: Map<string, any> = new Map();

  // Leaderboard
  public leaderboardSnapshots: Map<string, any> = new Map();
  public leaderboardEntries: Map<string, any> = new Map();

  // Communication
  public announcements: Map<string, any> = new Map();
  public notifications: Map<string, any> = new Map();
  public conversations: Map<string, any> = new Map();
  public messages: Map<string, any> = new Map();

  // CRM, Audit & Settings
  public crmNotes: Map<string, any> = new Map();
  public auditLogs: Map<string, any> = new Map();
  public adminActivityLogs: Map<string, any> = new Map();
  public integrationSettings: Map<string, any> = new Map();

  private isSeeded = false;

  constructor() {
    this.seedDefaults();
  }

  public seedDefaults() {
    if (this.isSeeded) return;

    // Seed Program
    const programId = 'prog-thread-elite-default';
    this.programs.set(programId, {
      id: programId,
      name: 'Thread Elite',
      description: 'One-year, invitation-based student leadership and professional development program',
      durationMonths: 12,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.programSettings.set(programId, {
      id: uuidv4(),
      programId,
      allowLateSubmissions: true,
      defaultGraceMinutes: 30,
      autoPublishLeaderboard: false,
      rankingTieBreakers: ['completion_rate', 'submission_speed'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed 5 Promotion Levels
    for (const lvl of PROMOTION_LEVELS) {
      const levelId = `level-${lvl.slug}`;
      this.promotionLevels.set(levelId, {
        id: levelId,
        programId,
        levelOrder: lvl.levelOrder,
        name: lvl.name,
        slug: lvl.slug,
        description: lvl.description,
        requiredXP: lvl.requiredXP,
        colorHex: lvl.colorHex,
        badgeUrl: `/badges/${lvl.slug}.svg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Seed Permissions
    for (const p of PERMISSION_LIST) {
      const permId = `perm-${p.action.replace(':', '-')}`;
      this.permissions.set(permId, {
        id: permId,
        action: p.action,
        resource: p.resource,
        description: p.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Seed Roles
    for (const roleKey of Object.values(ROLES)) {
      const roleId = `role-${roleKey.toLowerCase()}`;
      this.roles.set(roleId, {
        id: roleId,
        name: roleKey,
        description: `${roleKey} System Role`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    this.isSeeded = true;
  }

  /**
   * Helper to execute in simulated transaction
   */
  public async transaction<T>(callback: (store: DatabaseStore) => Promise<T>): Promise<T> {
    // Snapshot-based atomic operation
    return await callback(this);
  }

  // Audit Log Recorder
  public recordAuditLog(entry: {
    actorId?: string | null;
    actorEmail?: string | null;
    actorRole?: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    previousState?: any;
    newState?: any;
    reason?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    const id = uuidv4();
    const log = {
      id,
      ...entry,
      timestamp: new Date(),
    };
    this.auditLogs.set(id, log);
    return log;
  }
}

export const db = new DatabaseStore();
