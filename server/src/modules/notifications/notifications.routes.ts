import { Router } from 'express';
import { notificationsController } from './notifications.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', notificationsController.getNotifications);
router.post('/read-all', notificationsController.markAllAsRead);
router.post('/:id/read', notificationsController.markAsRead);

export default router;
