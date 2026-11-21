import { Router } from 'express';
import { z } from 'zod';
import { usersController } from './users.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MENTOR', 'ELITE']),
  phone: z.string().optional(),
  initialPassword: z.string().optional(),
  eliteId: z.string().optional(),
  promotionLevelId: z.string().optional(),
  assignedMentorId: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

const provisionSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
  fullName: z.string().min(2).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MENTOR', 'ELITE']),
  promotionLevelId: z.string().optional(),
  permittedModules: z.array(z.string()).optional(),
});

// User listing & creation (Admin & Super Admin)
router.get('/', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), usersController.getUsers);
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateBody(createUserSchema), usersController.createUser);
router.post('/provision-dashboard-access', requireRole(ROLES.SUPER_ADMIN), validateBody(provisionSchema), usersController.provisionDashboardAccess);

// Individual User operations
router.get('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MENTOR), usersController.getUserById);
router.post('/:id/archive', requireRole(ROLES.SUPER_ADMIN), usersController.archiveUser);
router.post('/:id/restore', requireRole(ROLES.SUPER_ADMIN), usersController.restoreUser);
router.post('/:id/deactivate', requireRole(ROLES.SUPER_ADMIN), usersController.deactivateUser);
router.post('/:id/activate', requireRole(ROLES.SUPER_ADMIN), usersController.activateUser);

export default router;
