import { Router } from 'express';
import { z } from 'zod';
import { xpController } from './xp.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES, XP_TRANSACTION_TYPES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const adjustSchema = z.object({
  eliteId: z.string(),
  amount: z.number().int(),
  type: z.enum([
    'TASK_COMPLETION',
    'ASSESSMENT',
    'PARTICIPATION',
    'LEADERSHIP',
    'BONUS',
    'EVENT_PARTICIPATION',
    'MANUAL_ADJUSTMENT',
    'PENALTY_DEDUCTION',
  ]),
  reason: z.string().min(5),
});

const reverseSchema = z.object({
  reason: z.string().min(5),
});

router.get('/transactions', xpController.getTransactions);
router.post('/adjustments', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateBody(adjustSchema), xpController.adjustXp);
router.post('/transactions/:id/reverse', requireRole(ROLES.SUPER_ADMIN), validateBody(reverseSchema), xpController.reverseTransaction);
router.post('/batches/:id/finalize', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), xpController.finalizeBatch);

export default router;
