import { Request, Response, NextFunction } from 'express';
import { storageService } from '../../infrastructure/storage/storageService.js';
import { sendSuccess } from '../../shared/utils.js';
import { ValidationError, NotFoundError } from '../../shared/errors.js';

export class FilesController {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ValidationError('No file uploaded or file rejected by security filter');
      }

      const fileRecord = await storageService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      return sendSuccess(res, fileRecord, 'File uploaded and secured successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async downloadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const file = storageService.getFile(req.params.id);
      if (!file) throw new NotFoundError('File not found or expired');

      return sendSuccess(res, {
        fileId: file.id,
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        storageKey: file.storageKey,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const filesController = new FilesController();
