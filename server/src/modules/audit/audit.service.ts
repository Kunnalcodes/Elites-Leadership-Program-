import { db } from '../../infrastructure/database/db.js';

export class AuditService {
  async getAuditLogs(params: {
    actorId?: string;
    action?: string;
    entity?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 50;

    let all = Array.from(db.auditLogs.values());

    if (params.actorId) {
      all = all.filter((l) => l.actorId === params.actorId);
    }
    if (params.action) {
      all = all.filter((l) => l.action === params.action);
    }
    if (params.entity) {
      all = all.filter((l) => l.entity === params.entity);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      all = all.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.entity.toLowerCase().includes(q) ||
          (l.reason && l.reason.toLowerCase().includes(q)) ||
          (l.actorEmail && l.actorEmail.toLowerCase().includes(q))
      );
    }

    all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const total = all.length;
    const startIndex = (page - 1) * limit;
    const paginated = all.slice(startIndex, startIndex + limit);

    return {
      logs: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const auditService = new AuditService();
