import { Request, Response, NextFunction } from 'express';
import { db } from '../infrastructure/database/db.js';
import { TokenSecurity } from '../infrastructure/security/tokens.js';
import { UnauthorizedError, ForbiddenError } from '../shared/errors.js';
import { AuthenticatedUser } from '../shared/types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      sessionToken?: string;
    }
  }
}

export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.session_token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return next();
    }

    const tokenHash = TokenSecurity.hashToken(token);

    let matchedSession: any = null;
    for (const session of db.sessions.values()) {
      if (session.sessionTokenHash === tokenHash) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession || matchedSession.revokedAt || new Date() > new Date(matchedSession.expiresAt)) {
      return next();
    }

    const user = db.users.get(matchedSession.userId);
    if (!user || user.status !== 'ACTIVE') {
      return next();
    }

    const profile = db.userProfiles.get(user.id);

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      fullName: profile?.fullName || user.email,
      eliteId: profile?.eliteId || null,
      permissions: [],
    };
    req.sessionToken = token;
    next();
  } catch (error) {
    next();
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.session_token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      throw new UnauthorizedError('Authentication required: no active session found');
    }

    const tokenHash = TokenSecurity.hashToken(token);

    // Look up session
    let matchedSession: any = null;
    for (const session of db.sessions.values()) {
      if (session.sessionTokenHash === tokenHash) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    if (matchedSession.revokedAt) {
      throw new UnauthorizedError('Session has been revoked');
    }

    if (new Date() > new Date(matchedSession.expiresAt)) {
      throw new UnauthorizedError('Session has expired');
    }

    const user = db.users.get(matchedSession.userId);
    if (!user) {
      throw new UnauthorizedError('User account not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenError(`Account is ${user.status.toLowerCase()}`);
    }

    const profile = db.userProfiles.get(user.id);

    // Get current promotion level if user is an Elite
    let currentLevelId: string | null = null;
    let currentLevelName: string | null = null;
    if (user.role === 'ELITE') {
      for (const mem of db.eliteLevelMemberships.values()) {
        if (mem.eliteId === user.id && mem.isCurrent) {
          currentLevelId = mem.promotionLevelId;
          const level = db.promotionLevels.get(mem.promotionLevelId);
          currentLevelName = level?.name || null;
          break;
        }
      }
    }

    // Get permissions
    const permissions: string[] = [];
    for (const assign of db.userRoleAssignments.values()) {
      if (assign.userId === user.id) {
        const perm = db.permissions.get(assign.permissionId);
        if (perm) permissions.push(perm.action);
      }
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      eliteId: profile?.eliteId || null,
      fullName: profile?.fullName || user.email,
      currentLevelId,
      currentLevelName,
      permissions,
    };
    req.sessionToken = token;

    next();
  } catch (error) {
    next(error);
  }
}
