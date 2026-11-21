import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { PasswordSecurity } from '../../infrastructure/security/password.js';
import { emailService } from '../../infrastructure/email/emailService.js';
import { NotFoundError, ConflictError, ValidationError } from '../../shared/errors.js';
import { ROLES, PROMOTION_LEVELS } from '../../config/constants.js';

export interface CreateUserDto {
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MENTOR' | 'ELITE';
  phone?: string;
  initialPassword?: string;
  eliteId?: string;
  promotionLevelId?: string;
  assignedMentorId?: string;
  permissions?: string[];
}

export class UsersService {
  async getUsers(params: {
    role?: string;
    status?: string;
    promotionLevelId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 25;
    const search = params.search?.toLowerCase();

    let allUsers = Array.from(db.users.values());

    if (params.role) {
      allUsers = allUsers.filter((u) => u.role === params.role);
    }
    if (params.status) {
      allUsers = allUsers.filter((u) => u.status === params.status);
    }

    // Map enriched details
    const enriched = allUsers.map((user) => {
      const profile = db.userProfiles.get(user.id);
      
      // Promotion level lookup
      let currentLevel = null;
      if (user.role === ROLES.ELITE) {
        for (const mem of db.eliteLevelMemberships.values()) {
          if (mem.eliteId === user.id && mem.isCurrent) {
            const lvl = db.promotionLevels.get(mem.promotionLevelId);
            if (lvl) {
              currentLevel = { id: lvl.id, name: lvl.name, slug: lvl.slug, levelOrder: lvl.levelOrder };
            }
            break;
          }
        }
      }

      // Mentor lookup
      let mentor = null;
      for (const assignment of db.mentorAssignments.values()) {
        if (assignment.eliteId === user.id && assignment.isActive) {
          const mentorUser = db.users.get(assignment.mentorId);
          const mentorProfile = db.userProfiles.get(assignment.mentorId);
          mentor = {
            id: assignment.mentorId,
            fullName: mentorProfile?.fullName || mentorUser?.email,
            email: mentorUser?.email,
          };
          break;
        }
      }

      // XP lookup
      const xpAcct = db.xpAccounts.get(user.id);
      const xpBalance = xpAcct?.currentBalance || 0;

      // Tasks stats
      let tasksAssigned = 0;
      let tasksCompleted = 0;
      for (const assignment of db.taskAssignments.values()) {
        if (assignment.eliteId === user.id) {
          tasksAssigned++;
          if (assignment.status === 'GRADED' || assignment.status === 'RESULT_PUBLISHED') {
            tasksCompleted++;
          }
        }
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        fullName: profile?.fullName || user.email,
        phone: profile?.phone || null,
        avatarUrl: profile?.avatarUrl || null,
        eliteId: profile?.eliteId || null,
        currentLevel,
        mentor,
        xpBalance,
        tasksAssigned,
        tasksCompleted,
        lastLoginAt: user.lastLoginAt || null,
        archivedAt: user.archivedAt || null,
        createdAt: user.createdAt,
      };
    });

    let filtered = enriched;
    if (params.promotionLevelId) {
      filtered = filtered.filter((u) => u.currentLevel?.id === params.promotionLevelId);
    }
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.fullName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          (u.eliteId && u.eliteId.toLowerCase().includes(search))
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      users: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string) {
    const user = db.users.get(userId);
    if (!user) throw new NotFoundError('User not found');

    const profile = db.userProfiles.get(userId);

    // Current level
    let currentLevel = null;
    const levelHistory = [];
    for (const mem of db.eliteLevelMemberships.values()) {
      if (mem.eliteId === userId) {
        const lvl = db.promotionLevels.get(mem.promotionLevelId);
        const entry = {
          levelId: mem.promotionLevelId,
          levelName: lvl?.name,
          isCurrent: mem.isCurrent,
          effectiveFrom: mem.effectiveFrom,
          effectiveTo: mem.effectiveTo,
        };
        levelHistory.push(entry);
        if (mem.isCurrent) currentLevel = lvl;
      }
    }

    // Mentor info
    let mentor = null;
    for (const ma of db.mentorAssignments.values()) {
      if (ma.eliteId === userId && ma.isActive) {
        const mUser = db.users.get(ma.mentorId);
        const mProfile = db.userProfiles.get(ma.mentorId);
        mentor = { id: ma.mentorId, fullName: mProfile?.fullName, email: mUser?.email };
        break;
      }
    }

    // XP Account & Recent Transactions
    const xpAcct = db.xpAccounts.get(userId);
    const xpTransactions = [];
    for (const tx of db.xpTransactions.values()) {
      if (tx.eliteId === userId) {
        xpTransactions.push(tx);
      }
    }
    xpTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // CRM notes
    const notes = [];
    for (const note of db.crmNotes.values()) {
      if (note.eliteId === userId) notes.push(note);
    }

    // Permissions
    const permissions = [];
    for (const p of db.userRoleAssignments.values()) {
      if (p.userId === userId) {
        const perm = db.permissions.get(p.permissionId);
        if (perm) permissions.push(perm);
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLoginAt: user.lastLoginAt,
        archivedAt: user.archivedAt,
        createdAt: user.createdAt,
      },
      profile,
      currentLevel,
      levelHistory,
      mentor,
      xpAccount: xpAcct || { currentBalance: 0, lifetimeEarned: 0, lifetimeDeducted: 0 },
      recentXpTransactions: xpTransactions.slice(0, 10),
      notes,
      permissions,
    };
  }

  async createUser(dto: CreateUserDto, actor: any) {
    const existing = Array.from(db.users.values()).find(
      (u) => u.email.toLowerCase() === dto.email.trim().toLowerCase()
    );
    if (existing) {
      throw new ConflictError(`User with email ${dto.email} already exists`);
    }

    const userId = uuidv4();
    const rawPassword = dto.initialPassword || 'ThreadElite2026!';
    const passwordHash = await PasswordSecurity.hash(rawPassword);

    const newUser = {
      id: userId,
      email: dto.email.trim().toLowerCase(),
      passwordHash,
      role: dto.role,
      status: 'ACTIVE',
      isEmailVerified: true,
      requiresPasswordReset: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.users.set(userId, newUser);

    // Profile
    let eliteId = dto.eliteId;
    if (dto.role === ROLES.ELITE && !eliteId) {
      const year = new Date().getFullYear();
      const count = Array.from(db.users.values()).filter((u) => u.role === ROLES.ELITE).length;
      eliteId = `ELITE-${year}-${String(count).padStart(3, '0')}`;
    }

    const newProfile = {
      id: uuidv4(),
      userId,
      eliteId: eliteId || null,
      fullName: dto.fullName,
      university: (dto as any).university || null,
      phone: dto.phone || null,
      avatarUrl: `/avatars/${dto.role.toLowerCase()}.png`,
      enrollmentStatus: 'ENROLLED',
      programStartDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.userProfiles.set(userId, newProfile);

    // If Elite, initialize XP Account and assign default promotion level (Level 1: Foundation)
    if (dto.role === ROLES.ELITE) {
      db.xpAccounts.set(userId, {
        id: uuidv4(),
        eliteId: userId,
        currentBalance: 0,
        lifetimeEarned: 0,
        lifetimeDeducted: 0,
        updatedAt: new Date(),
      });

      const targetLevelId = dto.promotionLevelId || 'level-foundation';
      const membershipId = uuidv4();
      db.eliteLevelMemberships.set(membershipId, {
        id: membershipId,
        eliteId: userId,
        promotionLevelId: targetLevelId,
        isCurrent: true,
        effectiveFrom: new Date(),
        promotedById: actor.id,
        createdAt: new Date(),
      });
    }

    // Assign Mentor if provided or auto-assign creating mentor
    const assignedMentorId = dto.assignedMentorId || (actor.role === ROLES.ADMIN ? actor.id : undefined);
    if (assignedMentorId) {
      const assignId = uuidv4();
      db.mentorAssignments.set(assignId, {
        id: assignId,
        mentorId: assignedMentorId,
        eliteId: userId,
        assignedById: actor.id,
        assignedAt: new Date(),
        isActive: true,
      });
    }

    // Assign permissions if provided
    if (dto.permissions && dto.permissions.length > 0) {
      for (const permAction of dto.permissions) {
        for (const p of db.permissions.values()) {
          if (p.action === permAction) {
            const assignId = uuidv4();
            db.userRoleAssignments.set(assignId, {
              id: assignId,
              userId,
              permissionId: p.id,
              grantedBy: actor.id,
              createdAt: new Date(),
            });
          }
        }
      }
    }

    // Dispatch activation email
    const setupToken = uuidv4();
    const setupLink = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/activate?token=${setupToken}`;
    await emailService.sendAccountActivationEmail(newUser.email, setupLink, newUser.role);

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'USER_CREATED',
      entity: 'User',
      entityId: userId,
      newState: { email: newUser.email, role: newUser.role, fullName: newProfile.fullName, eliteId },
      reason: 'Administrator created user record',
    });

    return {
      userId,
      email: newUser.email,
      fullName: newProfile.fullName,
      role: newUser.role,
      eliteId: newProfile.eliteId,
    };
  }

  /**
   * One-click Access Provisioning Engine
   */
  async provisionDashboardAccess(
    dto: {
      userId?: string;
      email?: string;
      fullName?: string;
      role: 'SUPER_ADMIN' | 'ADMIN' | 'MENTOR' | 'ELITE';
      promotionLevelId?: string;
      permittedModules?: string[];
    },
    actor: any
  ) {
    let targetUser: any = null;

    if (dto.userId) {
      targetUser = db.users.get(dto.userId);
    } else if (dto.email) {
      targetUser = Array.from(db.users.values()).find(
        (u) => u.email.toLowerCase() === dto.email!.trim().toLowerCase()
      );
    }

    // Create user if not existing
    if (!targetUser) {
      if (!dto.email || !dto.fullName) {
        throw new ValidationError('Email and Full Name required for new account provisioning');
      }
      const created = await this.createUser(
        {
          email: dto.email,
          fullName: dto.fullName,
          role: dto.role,
          promotionLevelId: dto.promotionLevelId,
          permissions: dto.permittedModules,
        },
        actor
      );
      targetUser = db.users.get(created.userId);
    } else {
      // Update role & activate
      targetUser.role = dto.role;
      targetUser.status = 'ACTIVE';
      targetUser.updatedAt = new Date();

      if (dto.role === ROLES.ELITE && dto.promotionLevelId) {
        // Update current level
        for (const mem of db.eliteLevelMemberships.values()) {
          if (mem.eliteId === targetUser.id && mem.isCurrent) {
            mem.isCurrent = false;
            mem.effectiveTo = new Date();
          }
        }
        const memId = uuidv4();
        db.eliteLevelMemberships.set(memId, {
          id: memId,
          eliteId: targetUser.id,
          promotionLevelId: dto.promotionLevelId,
          isCurrent: true,
          effectiveFrom: new Date(),
          promotedById: actor.id,
          createdAt: new Date(),
        });
      }
    }

    // Generate activation / password setup link
    const setupToken = uuidv4();
    const setupLink = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/activate?token=${setupToken}`;

    // Send account activation email
    await emailService.sendAccountActivationEmail(targetUser.email, setupLink, targetUser.role);

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'DASHBOARD_ACCESS_PROVISIONED',
      entity: 'User',
      entityId: targetUser.id,
      newState: { status: 'ACTIVE', role: targetUser.role },
      reason: 'One-click dashboard access provisioning executed',
    });

    return {
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      status: targetUser.status,
      activationEmailSent: true,
      message: 'Dashboard access granted and activation instructions dispatched',
    };
  }

  async archiveUser(userId: string, actor: any) {
    const user = db.users.get(userId);
    if (!user) throw new NotFoundError('User not found');

    const previousState = { status: user.status, archivedAt: user.archivedAt };
    user.status = 'ARCHIVED';
    user.archivedAt = new Date();
    user.updatedAt = new Date();

    // Revoke all sessions
    for (const session of db.sessions.values()) {
      if (session.userId === userId) session.revokedAt = new Date();
    }

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'USER_ARCHIVED',
      entity: 'User',
      entityId: userId,
      previousState,
      newState: { status: user.status, archivedAt: user.archivedAt },
      reason: 'Administrator soft-archived user; academic and XP records preserved',
    });

    return { userId, status: user.status };
  }

  async restoreUser(userId: string, actor: any) {
    const user = db.users.get(userId);
    if (!user) throw new NotFoundError('User not found');

    const previousState = { status: user.status, archivedAt: user.archivedAt };
    user.status = 'ACTIVE';
    user.archivedAt = null;
    user.updatedAt = new Date();

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'USER_RESTORED',
      entity: 'User',
      entityId: userId,
      previousState,
      newState: { status: user.status },
      reason: 'Administrator restored previously archived user',
    });

    return { userId, status: user.status };
  }

  async deactivateUser(userId: string, actor: any) {
    const user = db.users.get(userId);
    if (!user) throw new NotFoundError('User not found');

    user.status = 'DEACTIVATED';
    user.updatedAt = new Date();

    // Revoke sessions
    for (const session of db.sessions.values()) {
      if (session.userId === userId) session.revokedAt = new Date();
    }

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'USER_DEACTIVATED',
      entity: 'User',
      entityId: userId,
      reason: 'Administrator deactivated user account',
    });

    return { userId, status: user.status };
  }

  async activateUser(userId: string, actor: any) {
    const user = db.users.get(userId);
    if (!user) throw new NotFoundError('User not found');

    user.status = 'ACTIVE';
    user.updatedAt = new Date();

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'USER_ACTIVATED',
      entity: 'User',
      entityId: userId,
      reason: 'Administrator reactivated user account',
    });

    return { userId, status: user.status };
  }
}

export const usersService = new UsersService();
