import { Request, Response, NextFunction } from 'express';
import { tasksService } from './tasks.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class TasksController {
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, category, promotionLevelId } = req.query;
      const tasks = await tasksService.getTasks(
        {
          status: status as string,
          category: category as string,
          promotionLevelId: promotionLevelId as string,
        },
        req.user
      );
      return sendSuccess(res, tasks, 'Tasks retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await tasksService.getTaskById(req.params.id, req.user);
      return sendSuccess(res, task, 'Task details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await tasksService.createTask(req.body, req.user);
      return sendSuccess(res, task, 'Task created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async publishTask(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await tasksService.publishTask(req.params.id, req.user);
      return sendSuccess(res, result, 'Task published and distributed successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await tasksService.updateTask(req.params.id, req.body, req.user);
      return sendSuccess(res, task, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async reopenTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { extendedDeadline, reason } = req.body;
      const result = await tasksService.reopenTask(req.params.id, extendedDeadline, reason, req.user);
      return sendSuccess(res, result, 'Task reopened');
    } catch (error) {
      next(error);
    }
  }

  async cancelTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { reason } = req.body;
      const result = await tasksService.cancelTask(req.params.id, reason, req.user);
      return sendSuccess(res, result, 'Task cancelled');
    } catch (error) {
      next(error);
    }
  }
}

export const tasksController = new TasksController();
