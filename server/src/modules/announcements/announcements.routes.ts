import { Router } from 'express';
import { z } from 'zod';
import { announcementsController } from './announcements.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const createSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  audienceType: z.enum(['ALL', 'PROMOTION_LEVEL', 'SELECTED_USERS', 'MENTOR_GROUP']),
  audienceValue: z.string().optional(),
  publishAt: z.string().optional(),
  expiresAt: z.string().optional(),
  attachments: z.array(z.any()).optional(),
  links: z.array(z.any()).optional(),
});

router.get('/', announcementsController.getAnnouncements);
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateBody(createSchema), announcementsController.createAnnouncement);
router.post('/:id/publish', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), announcementsController.publishAnnouncement);

export default router;
