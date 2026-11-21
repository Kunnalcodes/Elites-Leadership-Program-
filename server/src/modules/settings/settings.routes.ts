import { Router } from 'express';
import { settingsController } from './settings.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

// Public / general health & integrations endpoint for UI indicators
router.get('/integrations', settingsController.getIntegrations);

export default router;
