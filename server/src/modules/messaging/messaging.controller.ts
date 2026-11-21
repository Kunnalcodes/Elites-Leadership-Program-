import { Request, Response, NextFunction } from 'express';
import { messagingService } from './messaging.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class MessagingController {
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await messagingService.getConversations(req.user);
      return sendSuccess(res, conversations, 'Conversations retrieved');
    } catch (error) {
      next(error);
    }
  }

  async startConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { mentorId, title, initialMessage, attachments } = req.body;
      const result = await messagingService.startConversation(
        req.user!.id,
        mentorId,
        title,
        initialMessage,
        attachments
      );
      return sendSuccess(res, result, 'Mentorship query initiated', 201);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await messagingService.getMessages(req.params.id, req.user);
      return sendSuccess(res, result, 'Messages retrieved');
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, attachments } = req.body;
      const result = await messagingService.sendMessage(req.params.id, req.user!.id, body, attachments, req.user?.role);
      return sendSuccess(res, result, 'Message sent', 201);
    } catch (error) {
      next(error);
    }
  }

  async resolveConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await messagingService.resolveConversation(req.params.id, req.user);
      return sendSuccess(res, result, 'Conversation marked as resolved');
    } catch (error) {
      next(error);
    }
  }
}

export const messagingController = new MessagingController();
