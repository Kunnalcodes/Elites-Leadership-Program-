import { Router } from 'express';
import { z } from 'zod';
import { gradingController } from './grading.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const evaluateSchema = z.object({
  versionNumber: z.number().int().positive().optional(),
  criteriaScores: z.array(z.object({
    criterionId: z.string(),
    score: z.number().int().min(0),
    feedback: z.string().optional(),
  })).min(1),
  generalFeedback: z.string().optional(),
  evaluatorNotes: z.string().optional(),
  isDraft: z.boolean().optional(),
});

const revisionSchema = z.object({
  reason: z.string().min(5),
});

// Admin & Mentor evaluation routes
router.post('/submissions/:id/evaluate', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MENTOR), validateBody(evaluateSchema), gradingController.evaluateSubmission);
router.post('/submissions/:id/publish-result', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), gradingController.publishResult);
router.post('/submissions/:id/request-revision', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MENTOR), validateBody(revisionSchema), gradingController.requestRevision);

export default router;
