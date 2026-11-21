import { db } from '../../infrastructure/database/db.js';
import { NotFoundError } from '../../shared/errors.js';

export class NotificationsService {
  async getUserNotifications(userId: string) {
    const list = [];
    for (const notif of db.notifications.values()) {
      if (notif.userId === userId) {
        list.push(notif);
      }
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = list.filter((n) => !n.isRead).length;

    return {
      notifications: list,
      unreadCount,
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notif = db.notifications.get(notificationId);
    if (!notif) throw new NotFoundError('Notification not found');
    if (notif.userId !== userId) throw new NotFoundError('Notification not found');

    notif.isRead = true;
    notif.readAt = new Date();

    return notif;
  }

  async markAllAsRead(userId: string) {
    let count = 0;
    const now = new Date();
    for (const notif of db.notifications.values()) {
      if (notif.userId === userId && !notif.isRead) {
        notif.isRead = true;
        notif.readAt = now;
        count++;
      }
    }
    return { markedCount: count };
  }
}

export const notificationsService = new NotificationsService();
