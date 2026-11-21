import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infrastructure/database/db.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../../shared/errors.js';
import { ROLES } from '../../config/constants.js';

export class MessagingService {
  async getConversations(user: any) {
    const list = [];
    for (const conv of db.conversations.values()) {
      if (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN) {
        list.push(conv);
      } else if (user.role === ROLES.ELITE && conv.eliteId === user.id) {
        list.push(conv);
      } else if (user.role === ROLES.MENTOR && conv.mentorId === user.id) {
        list.push(conv);
      }
    }

    list.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

    return list.map((c) => {
      const elite = db.users.get(c.eliteId);
      const eliteProfile = db.userProfiles.get(c.eliteId);
      const mentor = db.users.get(c.mentorId);
      const mentorProfile = db.userProfiles.get(c.mentorId);

      return {
        ...c,
        elite: { id: c.eliteId, fullName: eliteProfile?.fullName || elite?.email, eliteId: eliteProfile?.eliteId },
        mentor: { id: c.mentorId, fullName: mentorProfile?.fullName || mentor?.email },
      };
    });
  }

  async startConversation(eliteId: string, mentorId: string, title: string, initialMessage: string, attachments?: any[]) {
    const elite = db.users.get(eliteId);
    if (!elite || elite.role !== ROLES.ELITE) throw new NotFoundError('Elite not found');

    const mentor = db.users.get(mentorId);
    if (!mentor || mentor.role !== ROLES.MENTOR) throw new NotFoundError('Mentor not found');

    const convId = uuidv4();
    const now = new Date();

    const conv = {
      id: convId,
      eliteId,
      mentorId,
      title: title || 'Mentorship Guidance Inquiry',
      status: 'WAITING_FOR_MENTOR',
      lastMessageAt: now,
      unreadEliteCount: 0,
      unreadMentorCount: 1,
      createdAt: now,
      updatedAt: now,
    };
    db.conversations.set(convId, conv);

    // Initial message
    const msgId = uuidv4();
    const msg = {
      id: msgId,
      conversationId: convId,
      senderId: eliteId,
      body: initialMessage,
      attachmentsJson: attachments || [],
      isRead: false,
      readAt: null,
      createdAt: now,
    };
    db.messages.set(msgId, msg);

    // Notify Mentor
    const notifId = uuidv4();
    db.notifications.set(notifId, {
      id: notifId,
      userId: mentorId,
      eventType: 'NEW_MENTOR_MESSAGE',
      title: `New Query from Elite: ${title}`,
      message: initialMessage.substring(0, 100),
      dataJson: { conversationId: convId, eliteId },
      channel: 'IN_APP',
      deliveryStatus: 'DELIVERED',
      isRead: false,
      createdAt: now,
    });

    return { conversation: conv, initialMessage: msg };
  }

  async getMessages(conversationId: string, user: any) {
    const conv = db.conversations.get(conversationId);
    if (!conv) throw new NotFoundError('Conversation not found');

    if (user.role === ROLES.ELITE && conv.eliteId !== user.id) {
      throw new ForbiddenError('Unauthorized access to conversation');
    }
    if (user.role === ROLES.MENTOR && conv.mentorId !== user.id) {
      throw new ForbiddenError('Unauthorized access to conversation');
    }

    // Mark messages as read
    const now = new Date();
    const messages = [];
    for (const m of db.messages.values()) {
      if (m.conversationId === conversationId) {
        if (m.senderId !== user.id && !m.isRead) {
          m.isRead = true;
          m.readAt = now;
        }
        const sender = db.users.get(m.senderId);
        const senderProfile = db.userProfiles.get(m.senderId);
        messages.push({
          ...m,
          senderName: senderProfile?.fullName || sender?.email,
          senderRole: sender?.role,
        });
      }
    }

    // Reset unread counters
    if (user.id === conv.eliteId) conv.unreadEliteCount = 0;
    if (user.id === conv.mentorId) conv.unreadMentorCount = 0;

    messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return { conversation: conv, messages };
  }

  async sendMessage(conversationId: string, senderId: string, body: string, attachments?: any[], senderRole?: string) {
    const conv = db.conversations.get(conversationId);
    if (!conv) throw new NotFoundError('Conversation not found');

    const isElite = senderId === conv.eliteId;
    const isMentor = senderId === conv.mentorId;
    const isSuperAdmin = senderRole === ROLES.SUPER_ADMIN;

    if (!isElite && !isMentor && !isSuperAdmin) {
      throw new ForbiddenError('Only assigned participants or Super Admin moderators can send messages in this thread');
    }

    const msgId = uuidv4();
    const now = new Date();

    const msg = {
      id: msgId,
      conversationId,
      senderId,
      body,
      attachmentsJson: attachments || [],
      isRead: false,
      readAt: null,
      createdAt: now,
    };
    db.messages.set(msgId, msg);

    // Update conversation
    conv.lastMessageAt = now;
    conv.updatedAt = now;
    if (isElite) {
      conv.status = 'WAITING_FOR_MENTOR';
      conv.unreadMentorCount += 1;
    } else {
      conv.status = 'WAITING_FOR_ELITE';
      conv.unreadEliteCount += 1;
    }

    return msg;
  }

  async resolveConversation(conversationId: string, actor: any) {
    const conv = db.conversations.get(conversationId);
    if (!conv) throw new NotFoundError('Conversation not found');

    conv.status = 'RESOLVED';
    conv.updatedAt = new Date();

    return { conversationId, status: conv.status };
  }
}

export const messagingService = new MessagingService();
