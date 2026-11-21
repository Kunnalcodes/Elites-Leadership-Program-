import { Router } from 'express';
import { auditController } from './audit.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

// Super Admin exclusive audit trail explorer
router.get('/', requireRole(ROLES.SUPER_ADMIN), auditController.getAuditLogs);

export default router;
