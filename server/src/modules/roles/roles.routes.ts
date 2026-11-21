import { Router } from 'express';
import { z } from 'zod';
import { rolesController } from './roles.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { validateBody } from '../../middleware/validate.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const updatePermissionsSchema = z.object({
  permissions: z.array(z.string()),
});

router.get('/roles', rolesController.getRoles);
router.get('/permissions', rolesController.getPermissions);
router.get('/admins/:id/permissions', requireRole(ROLES.SUPER_ADMIN), rolesController.getAdminPermissions);
router.patch('/admins/:id/permissions', requireRole(ROLES.SUPER_ADMIN), validateBody(updatePermissionsSchema), rolesController.updateAdminPermissions);
router.post('/admins/:id/revoke-access', requireRole(ROLES.SUPER_ADMIN), rolesController.revokeAdminAccess);

export default router;
