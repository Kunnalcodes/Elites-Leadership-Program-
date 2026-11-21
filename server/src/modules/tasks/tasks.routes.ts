import { Router } from 'express';
import { z } from 'zod';
import { tasksController } from './tasks.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES, TASK_FORMATS } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const createTaskSchema = z.object({
  title: z.string().min(3),
  shortDescription: z.string().min(5),
  instructions: z.string().min(10),
  objectives: z.array(z.string()).optional(),
  category: z.string(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  taskFormat: z.array(z.string()).min(1),
  maxXP: z.number().int().positive(),
  submissionDeadline: z.string(),
  timezone: z.string().optional(),
  targetType: z.enum(['ALL', 'PROMOTION_LEVEL', 'INDIVIDUAL', 'COHORT']),
  targetValue: z.string(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    resourceType: z.string(),
    isRequired: z.boolean().optional(),
  })).optional(),
  rubricCriteria: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    maxScore: z.number().int().positive(),
    weight: z.number().optional(),
  })).optional(),
});

router.get('/', tasksController.getTasks);
router.get('/:id', tasksController.getTaskById);

// Admin task controls
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateBody(createTaskSchema), tasksController.createTask);
router.patch('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), tasksController.updateTask);
router.post('/:id/publish', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), tasksController.publishTask);
router.post('/:id/reopen', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), tasksController.reopenTask);
router.post('/:id/cancel', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), tasksController.cancelTask);

export default router;
