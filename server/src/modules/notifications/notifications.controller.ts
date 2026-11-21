import { Request, Response, NextFunction } from 'express';
import { notificationsService } from './notifications.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class NotificationsController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.getUserNotifications(req.user!.id);
      return sendSuccess(res, result.notifications, 'Notifications retrieved', 200, { unreadCount: result.unreadCount });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notif = await notificationsService.markAsRead(req.params.id, req.user!.id);
      return sendSuccess(res, notif, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.markAllAsRead(req.user!.id);
      return sendSuccess(res, result, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }
}

export const notificationsController = new NotificationsController();
