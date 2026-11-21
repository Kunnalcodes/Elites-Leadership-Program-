import { Router } from 'express';
import { z } from 'zod';
import { promotionsController } from './promotions.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const updateLevelSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  requiredXP: z.number().int().min(0).optional(),
  colorHex: z.string().optional(),
  badgeUrl: z.string().optional(),
});

const promoteEliteSchema = z.object({
  targetLevelId: z.string(),
  reason: z.string().min(5),
  notes: z.string().optional(),
});

router.get('/promotion-levels', promotionsController.getPromotionLevels);
router.get('/promotion-levels/:id', promotionsController.getPromotionLevelById);
router.patch('/promotion-levels/:id', requireRole(ROLES.SUPER_ADMIN), validateBody(updateLevelSchema), promotionsController.updatePromotionLevel);

router.post('/elites/:id/promote', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateBody(promoteEliteSchema), promotionsController.promoteElite);
router.get('/elites/:id/promotion-history', promotionsController.getPromotionHistory);

export default router;
