import { Router } from 'express';
import { z } from 'zod';
import { leaderboardController } from './leaderboard.controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

const publishSchema = z.object({
  scope: z.enum(['OVERALL', 'PROMOTION_LEVEL', 'MONTHLY', 'QUARTERLY']).default('OVERALL'),
  levelId: z.string().optional(),
  title: z.string().min(3),
});

router.get('/', optionalAuthenticate, leaderboardController.getLeaderboard);
router.get('/top-three', optionalAuthenticate, leaderboardController.getTopThree);
router.get('/meta', optionalAuthenticate, leaderboardController.getChampionshipMeta);
router.get('/history', optionalAuthenticate, leaderboardController.getHistory);

router.post('/publish', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateBody(publishSchema), leaderboardController.publishSnapshot);
router.post('/recalculate', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), leaderboardController.recalculate);

export default router;
