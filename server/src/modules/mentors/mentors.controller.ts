import { Request, Response, NextFunction } from 'express';
import { mentorsService } from './mentors.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class MentorsController {
  async getMentors(req: Request, res: Response, next: NextFunction) {
    try {
      const mentors = await mentorsService.getMentors();
      return sendSuccess(res, mentors, 'Mentors retrieved');
    } catch (error) {
      next(error);
    }
  }

  async assignMentor(req: Request, res: Response, next: NextFunction) {
    try {
      const { mentorId, eliteId, notes } = req.body;
      const result = await mentorsService.assignMentor(mentorId, eliteId, req.user, notes);
      return sendSuccess(res, result, 'Mentor assigned successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyElites(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = await mentorsService.getMentorWorkspace(req.user!.id);
      return sendSuccess(res, workspace, 'Mentor workspace data retrieved');
    } catch (error) {
      next(error);
    }
  }

  async recordSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { eliteId, notes } = req.body;
      const result = await mentorsService.recordMentoringSession(req.user!.id, eliteId, notes, req.user);
      return sendSuccess(res, result, 'Mentoring session note saved', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const mentorsController = new MentorsController();
