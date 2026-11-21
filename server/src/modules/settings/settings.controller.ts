import { Request, Response, NextFunction } from 'express';
import { settingsService } from './settings.service.js';
import { sendSuccess } from '../../shared/utils.js';

export class SettingsController {
  async getIntegrations(req: Request, res: Response, next: NextFunction) {
    try {
      const integrations = await settingsService.getIntegrationRegistry();
      return sendSuccess(res, { integrations }, 'Integration registry status retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
