import { Request, Response, NextFunction } from 'express';
import { announcementsService } from './announcements.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class AnnouncementsController {
  async getAnnouncements(req: Request, res: Response, next: NextFunction) {
    try {
      const announcements = await announcementsService.getAnnouncements(req.user);
      return sendSuccess(res, announcements, 'Announcements retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementsService.createAnnouncement(req.body, req.user);
      return sendSuccess(res, announcement, 'Announcement created as draft', 201);
    } catch (error) {
      next(error);
    }
  }

  async publishAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await announcementsService.publishAnnouncement(req.params.id, req.user);
      return sendSuccess(res, result, 'Announcement broadcasted and published');
    } catch (error) {
      next(error);
    }
  }
}

export const announcementsController = new AnnouncementsController();
