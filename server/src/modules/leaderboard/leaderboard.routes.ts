import { Router } from 'express';
import { z } from 'zod';
import { leaderboardController } from './leaderboard.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const publishSchema = z.object({
  scope: z.enum(['OVERALL', 'PROMOTION_LEVEL', 'MONTHLY', 'QUARTERLY']).default('OVERALL'),
  levelId: z.string().optional(),
  title: z.string().min(3),
});

router.get('/', leaderboardController.getLeaderboard);
router.get('/top-three', leaderboardController.getTopThree);
router.get('/history', leaderboardController.getHistory);

router.post('/publish', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateBody(publishSchema), leaderboardController.publishSnapshot);
router.post('/recalculate', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), leaderboardController.recalculate);

export default router;
