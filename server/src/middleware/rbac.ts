import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../shared/errors.js';
import { ROLES, UserRoleType } from '../config/constants.js';

export function requireRole(...allowedRoles: UserRoleType[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next(); // Super Admin always authorized
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied: Requires role ${allowedRoles.join(' or ')}`));
    }

    next();
  };
}

export function requirePermission(action: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next(); // Super Admin has all permissions
    }

    const hasPerm = req.user.permissions?.includes(action);
    if (!hasPerm) {
      return next(new ForbiddenError(`Access denied: Missing required permission [${action}]`));
    }

    next();
  };
}
