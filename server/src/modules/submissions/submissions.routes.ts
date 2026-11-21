import { Router } from 'express';
import { z } from 'zod';
import { submissionsController } from './submissions.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { requireRole } from '../../middleware/rbac.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const submitSchema = z.object({
  textResponse: z.string().optional(),
  files: z.array(z.object({
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    storageKey: z.string().optional(),
  })).optional(),
  links: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
    platform: z.string().optional(),
  })).optional(),
});

// Elite submits to a task
router.post('/tasks/:id/submissions', requireRole(ROLES.ELITE), validateBody(submitSchema), submissionsController.submitTask);
router.post('/submissions/:id/resubmit', requireRole(ROLES.ELITE), validateBody(submitSchema), (req, res, next) => {
  // Map submission to task and submit new version
  req.params.id = req.body.taskId || req.params.id;
  return submissionsController.submitTask(req, res, next);
});

// List and get submissions
router.get('/submissions', submissionsController.getSubmissions);
router.get('/submissions/:id', submissionsController.getSubmissionById);

export default router;
