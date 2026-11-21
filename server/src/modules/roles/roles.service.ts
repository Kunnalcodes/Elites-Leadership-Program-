import { db } from '../../infrastructure/database/db.js';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../shared/errors.js';
import { ROLES } from '../../config/constants.js';

export class RolesService {
  async getRoles() {
    return Array.from(db.roles.values());
  }

  async getPermissions() {
    return Array.from(db.permissions.values());
  }

  async getAdminPermissions(adminId: string) {
    const admin = db.users.get(adminId);
    if (!admin) throw new NotFoundError('Admin user not found');

    const assigned = [];
    for (const a of db.userRoleAssignments.values()) {
      if (a.userId === adminId) {
        const perm = db.permissions.get(a.permissionId);
        if (perm) assigned.push(perm);
      }
    }
    return assigned;
  }

  async updateAdminPermissions(adminId: string, permissionActions: string[], actor: any) {
    const admin = db.users.get(adminId);
    if (!admin) throw new NotFoundError('Admin user not found');

    // Remove existing
    for (const [key, a] of db.userRoleAssignments.entries()) {
      if (a.userId === adminId) {
        db.userRoleAssignments.delete(key);
      }
    }

    // Assign new
    const granted = [];
    for (const action of permissionActions) {
      for (const p of db.permissions.values()) {
        if (p.action === action) {
          const assignId = uuidv4();
          const assignment = {
            id: assignId,
            userId: adminId,
            permissionId: p.id,
            grantedBy: actor.id,
            createdAt: new Date(),
          };
          db.userRoleAssignments.set(assignId, assignment);
          granted.push(p.action);
        }
      }
    }

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'ADMIN_PERMISSIONS_UPDATED',
      entity: 'UserRoleAssignment',
      entityId: adminId,
      newState: { permissions: granted },
      reason: 'Administrator updated admin granular permissions',
    });

    return { adminId, permissions: granted };
  }

  async revokeAdminAccess(adminId: string, actor: any) {
    const admin = db.users.get(adminId);
    if (!admin) throw new NotFoundError('Admin user not found');

    // Demote to basic or deactivated
    admin.role = ROLES.ELITE;
    admin.status = 'SUSPENDED';

    // Remove all permissions
    for (const [key, a] of db.userRoleAssignments.entries()) {
      if (a.userId === adminId) {
        db.userRoleAssignments.delete(key);
      }
    }

    // Revoke active sessions
    for (const session of db.sessions.values()) {
      if (session.userId === adminId) {
        session.revokedAt = new Date();
      }
    }

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'ADMIN_ACCESS_REVOKED',
      entity: 'User',
      entityId: adminId,
      reason: 'Administrator revoked administrative privileges',
    });

    return { adminId, revoked: true };
  }
}

export const rolesService = new RolesService();
