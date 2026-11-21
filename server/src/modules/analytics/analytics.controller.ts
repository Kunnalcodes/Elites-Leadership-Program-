import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service.js';
import { sendSuccess } from '../../shared/utils.js';
import { NotFoundError } from '../../shared/errors.js';

export class AnalyticsController {
  async getSuperAdminAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getSuperAdminAnalytics();
      return sendSuccess(res, data, 'Super Admin analytics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAdminAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getAdminAnalytics(req.user);
      return sendSuccess(res, data, 'Admin analytics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getEliteAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getEliteAnalytics(req.user);
      return sendSuccess(res, data, 'Elite dashboard analytics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getPromotionLevelAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getPromotionLevelAnalytics(req.params.levelId, req.user);
      if (!data) throw new NotFoundError('Promotion level dashboard not found');
      return sendSuccess(res, data, `${data.level.name} Level dashboard data retrieved`);
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
