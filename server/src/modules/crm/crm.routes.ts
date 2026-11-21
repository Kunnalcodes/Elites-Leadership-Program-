import { Router } from 'express';
import { z } from 'zod';
import { crmController } from './crm.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const noteSchema = z.object({
  category: z.enum(['ACADEMIC', 'DISCIPLINARY', 'ACHIEVEMENT', 'ADMINISTRATIVE', 'GENERAL', 'MENTORSHIP']),
  note: z.string().min(3),
  isConfidential: z.boolean().optional(),
});

router.get('/elites/:id/timeline', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MENTOR), crmController.getTimeline);
router.post('/elites/:id/notes', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateBody(noteSchema), crmController.addNote);

export default router;
