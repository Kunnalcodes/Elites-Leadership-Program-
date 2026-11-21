import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

router.get('/super-admin', requireRole(ROLES.SUPER_ADMIN), analyticsController.getSuperAdminAnalytics);
router.get('/admin', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), analyticsController.getAdminAnalytics);
router.get('/elite', requireRole(ROLES.ELITE), analyticsController.getEliteAnalytics);
router.get('/level/:levelId', analyticsController.getPromotionLevelAnalytics);

export default router;
