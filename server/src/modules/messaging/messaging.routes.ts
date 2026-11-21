import { Router } from 'express';
import { z } from 'zod';
import { messagingController } from './messaging.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { requireRole } from '../../middleware/rbac.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.use(authenticate);

const startConvSchema = z.object({
  mentorId: z.string(),
  title: z.string().min(3),
  initialMessage: z.string().min(5),
  attachments: z.array(z.any()).optional(),
});

const sendMsgSchema = z.object({
  body: z.string().min(1),
  attachments: z.array(z.any()).optional(),
});

router.get('/conversations', messagingController.getConversations);
router.post('/conversations', requireRole(ROLES.ELITE), validateBody(startConvSchema), messagingController.startConversation);
router.get('/conversations/:id/messages', messagingController.getMessages);
router.post('/conversations/:id/messages', validateBody(sendMsgSchema), messagingController.sendMessage);
router.post('/conversations/:id/resolve', messagingController.resolveConversation);

export default router;
