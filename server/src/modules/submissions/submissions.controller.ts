import { Request, Response, NextFunction } from 'express';
import { submissionsService } from './submissions.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class SubmissionsController {
  async submitTask(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await submissionsService.submitTask(req.params.id, req.user!.id, req.body);
      return sendSuccess(res, result, result.confirmationMessage, 201);
    } catch (error) {
      next(error);
    }
  }

  async getSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId, eliteId, status } = req.query;
      const submissions = await submissionsService.getSubmissions(
        {
          taskId: taskId as string,
          eliteId: eliteId as string,
          status: status as string,
        },
        req.user
      );
      return sendSuccess(res, submissions, 'Submissions retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const submission = await submissionsService.getSubmissionById(req.params.id, req.user);
      return sendSuccess(res, submission, 'Submission details retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const submissionsController = new SubmissionsController();
