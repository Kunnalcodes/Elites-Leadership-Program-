import { Request, Response, NextFunction } from 'express';
import { auditService } from './audit.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class AuditController {
  async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { actorId, action, entity, search, page, limit } = req.query;
      const result = await auditService.getAuditLogs({
        actorId: actorId as string,
        action: action as string,
        entity: entity as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
      });
      return sendSuccess(res, result.logs, 'Audit logs retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }
}

export const auditController = new AuditController();
