import { Request, Response, NextFunction } from 'express';
import { rolesService } from './roles.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class RolesController {
  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await rolesService.getRoles();
      return sendSuccess(res, roles, 'Roles retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await rolesService.getPermissions();
      return sendSuccess(res, permissions, 'Permissions list retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAdminPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await rolesService.getAdminPermissions(req.params.id);
      return sendSuccess(res, permissions, 'Admin permissions retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateAdminPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await rolesService.updateAdminPermissions(req.params.id, req.body.permissions, req.user);
      return sendSuccess(res, result, 'Admin permissions updated');
    } catch (error) {
      next(error);
    }
  }

  async revokeAdminAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await rolesService.revokeAdminAccess(req.params.id, req.user);
      return sendSuccess(res, result, 'Admin access revoked');
    } catch (error) {
      next(error);
    }
  }
}

export const rolesController = new RolesController();
