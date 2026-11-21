import { Request, Response, NextFunction } from 'express';
import { gradingService } from './grading.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class GradingController {
  async evaluateSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gradingService.evaluateSubmission(req.params.id, req.body, req.user);
      return sendSuccess(res, result, result.isPublished ? 'Evaluation published and XP awarded' : 'Evaluation draft saved');
    } catch (error) {
      next(error);
    }
  }

  async publishResult(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gradingService.publishEvaluation(req.params.id, req.user);
      return sendSuccess(res, result, 'Evaluation result published and XP ledger transaction posted');
    } catch (error) {
      next(error);
    }
  }

  async requestRevision(req: Request, res: Response, next: NextFunction) {
    try {
      const { reason } = req.body;
      const result = await gradingService.requestRevision(req.params.id, reason, req.user);
      return sendSuccess(res, result, 'Revision requested from Elite');
    } catch (error) {
      next(error);
    }
  }
}

export const gradingController = new GradingController();
