import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { NotFoundError, ValidationError } from '../../shared/errors.js';
import { ROLES, ANNOUNCEMENT_PRIORITIES, ANNOUNCEMENT_STATUSES } from '../../config/constants.js';

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  audienceType: 'ALL' | 'PROMOTION_LEVEL' | 'SELECTED_USERS' | 'MENTOR_GROUP';
  audienceValue?: string; // Level ID, etc.
  publishAt?: string;
  expiresAt?: string;
  attachments?: any[];
  links?: any[];
}

export class AnnouncementsService {
  async getAnnouncements(user: any) {
    let all = Array.from(db.announcements.values());

    if (user.role === ROLES.ELITE) {
      all = all.filter((a) => {
        if (a.status !== 'PUBLISHED') return false;
        if (a.audienceType === 'ALL') return true;
        if (a.audienceType === 'PROMOTION_LEVEL') {
          return a.audienceValue === user.currentLevelId;
        }
        if (a.audienceType === 'SELECTED_USERS') {
          return a.audienceValue?.includes(user.id);
        }
        return false;
      });
    }

    all.sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());
    return all;
  }

  async createAnnouncement(dto: CreateAnnouncementDto, author: any) {
    const id = uuidv4();
    const recipientCount = this.calculateRecipientCount(dto.audienceType, dto.audienceValue);

    const announcement = {
      id,
      title: dto.title,
      content: dto.content,
      priority: dto.priority || 'NORMAL',
      status: 'DRAFT',
      audienceType: dto.audienceType,
      audienceValue: dto.audienceValue || null,
      publishAt: dto.publishAt ? new Date(dto.publishAt) : new Date(),
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      senderId: author.id,
      senderName: author.fullName,
      attachmentsJson: dto.attachments || [],
      linksJson: dto.links || [],
      recipientCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.announcements.set(id, announcement);

    db.recordAuditLog({
      actorId: author.id,
      actorEmail: author.email,
      actorRole: author.role,
      action: 'ANNOUNCEMENT_DRAFT_CREATED',
      entity: 'Announcement',
      entityId: id,
      newState: { title: dto.title, audienceType: dto.audienceType, recipientCount },
      reason: 'Draft announcement created',
    });

    return announcement;
  }

  async publishAnnouncement(announcementId: string, actor: any) {
    const announcement = db.announcements.get(announcementId);
    if (!announcement) throw new NotFoundError('Announcement not found');

    const now = new Date();
    announcement.status = 'PUBLISHED';
    announcement.publishAt = now;
    announcement.updatedAt = now;

    // Dispatch notifications to target audience
    const targetUsers = this.getTargetUsers(announcement.audienceType, announcement.audienceValue);
    announcement.recipientCount = targetUsers.length;

    for (const u of targetUsers) {
      const notifId = uuidv4();
      db.notifications.set(notifId, {
        id: notifId,
        userId: u.id,
        announcementId: announcement.id,
        eventType: 'NEW_ANNOUNCEMENT',
        title: `Announcement: ${announcement.title}`,
        message: announcement.content.substring(0, 150) + (announcement.content.length > 150 ? '...' : ''),
        dataJson: { announcementId: announcement.id, priority: announcement.priority },
        channel: 'IN_APP',
        deliveryStatus: 'DELIVERED',
        isRead: false,
        createdAt: now,
      });
    }

    db.recordAuditLog({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'ANNOUNCEMENT_PUBLISHED',
      entity: 'Announcement',
      entityId: announcementId,
      newState: { status: 'PUBLISHED', recipientCount: targetUsers.length },
      reason: 'Broadcast announcement published and delivered to target audience',
    });

    return {
      announcementId,
      status: 'PUBLISHED',
      recipientCount: targetUsers.length,
      publishedAt: now,
    };
  }

  private calculateRecipientCount(audienceType: string, audienceValue?: string): number {
    return this.getTargetUsers(audienceType, audienceValue).length;
  }

  private getTargetUsers(audienceType: string, audienceValue?: string): any[] {
    const activeElites = Array.from(db.users.values()).filter(
      (u) => u.role === ROLES.ELITE && u.status === 'ACTIVE'
    );

    if (audienceType === 'ALL') {
      return activeElites;
    }

    if (audienceType === 'PROMOTION_LEVEL' && audienceValue) {
      const matched = [];
      for (const elite of activeElites) {
        for (const mem of db.eliteLevelMemberships.values()) {
          if (mem.eliteId === elite.id && mem.isCurrent && mem.promotionLevelId === audienceValue) {
            matched.push(elite);
            break;
          }
        }
      }
      return matched;
    }

    if (audienceType === 'SELECTED_USERS' && audienceValue) {
      return activeElites.filter((u) => audienceValue.includes(u.id));
    }

    return activeElites;
  }
}

export const announcementsService = new AnnouncementsService();
