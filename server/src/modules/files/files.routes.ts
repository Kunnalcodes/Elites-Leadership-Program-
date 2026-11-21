import { Router } from 'express';
import multer from 'multer';
import { filesController } from './files.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Configure memory storage with 50MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

router.post('/upload', authenticate, upload.single('file'), filesController.uploadFile);
router.get('/download/:id', authenticate, filesController.downloadFile);

export default router;
