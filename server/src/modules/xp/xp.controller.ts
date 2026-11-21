import { Request, Response, NextFunction } from 'express';
import { xpService } from './xp.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class XpController {
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { eliteId, type, limit } = req.query;
      const targetEliteId = req.user?.role === 'ELITE' ? req.user.id : (eliteId as string);
      const transactions = await xpService.getTransactions({
        eliteId: targetEliteId,
        type: type as string,
        limit: limit ? parseInt(limit as string, 10) : 50,
      });
      return sendSuccess(res, transactions, 'XP transactions retrieved');
    } catch (error) {
      next(error);
    }
  }

  async adjustXp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await xpService.adjustXp(req.body, req.user);
      return sendSuccess(res, result, 'XP adjusted and ledger entry recorded', 201);
    } catch (error) {
      next(error);
    }
  }

  async reverseTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { reason } = req.body;
      const result = await xpService.reverseTransaction(req.params.id, reason, req.user);
      return sendSuccess(res, result, 'XP transaction reversed successfully');
    } catch (error) {
      next(error);
    }
  }

  async finalizeBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await xpService.finalizeBatch(req.params.id, req.user);
      return sendSuccess(res, result, result.status);
    } catch (error) {
      next(error);
    }
  }
}

export const xpController = new XpController();
