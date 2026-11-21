import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class UsersController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { role, status, promotionLevelId, search, page, limit } = req.query;
      const result = await usersService.getUsers({
        role: role as string,
        status: status as string,
        promotionLevelId: promotionLevelId as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 25,
      });
      return sendSuccess(res, result.users, 'Users retrieved successfully', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.getUserById(req.params.id);
      return sendSuccess(res, user, 'User details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.createUser(req.body, req.user);
      return sendSuccess(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async provisionDashboardAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await usersService.provisionDashboardAccess(req.body, req.user);
      return sendSuccess(res, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  }

  async archiveUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await usersService.archiveUser(req.params.id, req.user);
      return sendSuccess(res, result, 'User archived successfully');
    } catch (error) {
      next(error);
    }
  }

  async restoreUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await usersService.restoreUser(req.params.id, req.user);
      return sendSuccess(res, result, 'User restored successfully');
    } catch (error) {
      next(error);
    }
  }

  async deactivateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await usersService.deactivateUser(req.params.id, req.user);
      return sendSuccess(res, result, 'User account deactivated');
    } catch (error) {
      next(error);
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await usersService.activateUser(req.params.id, req.user);
      return sendSuccess(res, result, 'User account activated');
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();
