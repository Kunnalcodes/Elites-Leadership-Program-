import { Router } from 'express';
import { z } from 'zod';
import { mentorsController } from './mentors.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const assignSchema = z.object({
  mentorId: z.string(),
  eliteId: z.string(),
  notes: z.string().optional(),
});

const sessionSchema = z.object({
  eliteId: z.string(),
  notes: z.string().min(5),
});

router.get('/', mentorsController.getMentors);
router.post('/assign', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateBody(assignSchema), mentorsController.assignMentor);
router.get('/my-elites', requireRole(ROLES.MENTOR), mentorsController.getMyElites);
router.post('/sessions', requireRole(ROLES.MENTOR), validateBody(sessionSchema), mentorsController.recordSession);

export default router;
