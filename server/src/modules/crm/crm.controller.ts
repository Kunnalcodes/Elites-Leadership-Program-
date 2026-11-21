import { Request, Response, NextFunction } from 'express';
import { crmService } from './crm.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class CrmController {
  async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await crmService.getEliteTimeline(req.params.id);
      return sendSuccess(res, data, 'Elite 1-year timeline retrieved');
    } catch (error) {
      next(error);
    }
  }

  async addNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, note, isConfidential } = req.body;
      const result = await crmService.addNote(req.params.id, category, note, isConfidential, req.user);
      return sendSuccess(res, result, 'CRM note recorded', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const crmController = new CrmController();
