import { Request, Response, NextFunction } from 'express';
import { promotionsService } from './promotions.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class PromotionsController {
  async getPromotionLevels(req: Request, res: Response, next: NextFunction) {
    try {
      const levels = await promotionsService.getPromotionLevels();
      return sendSuccess(res, levels, 'Promotion levels retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getPromotionLevelById(req: Request, res: Response, next: NextFunction) {
    try {
      const level = await promotionsService.getPromotionLevelById(req.params.id);
      return sendSuccess(res, level, 'Promotion level retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updatePromotionLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const level = await promotionsService.updatePromotionLevel(req.params.id, req.body, req.user);
      return sendSuccess(res, level, 'Promotion level updated');
    } catch (error) {
      next(error);
    }
  }

  async promoteElite(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetLevelId, reason, notes } = req.body;
      const result = await promotionsService.promoteElite(req.params.id, targetLevelId, reason, notes, req.user);
      return sendSuccess(res, result, `Elite promoted to ${result.newLevel} successfully`);
    } catch (error) {
      next(error);
    }
  }

  async getPromotionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await promotionsService.getPromotionHistory(req.params.id);
      return sendSuccess(res, history, 'Promotion history retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const promotionsController = new PromotionsController();
