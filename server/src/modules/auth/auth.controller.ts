import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { sendSuccess } from '../../shared/utils.js';
import { db } from '../../infrastructure/database/db.js';

export class AuthController {
  async superAdminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email || req.body.secretKey;
      const password = req.body.password || req.body.passkey;
      const result = await authService.superAdminLogin(email, password);
      return sendSuccess(res, result, 'Super Admin login initiated; OTP required');
    } catch (error) {
      next(error);
    }
  }

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email || req.body.secretKey;
      const password = req.body.password || req.body.passkey;
      const result = await authService.adminLogin(email, password);
      return sendSuccess(res, result, 'Admin login initiated; OTP required');
    } catch (error) {
      next(error);
    }
  }

  async validateIdentity(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier } = req.body;
      const result = await authService.validateIdentity(identifier);
      return sendSuccess(res, result, 'Identity validated successfully');
    } catch (error) {
      next(error);
    }
  }

  async eliteLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { eliteId, password } = req.body;
      const result = await authService.eliteLogin(eliteId, password);
      return sendSuccess(res, result, 'Elite login initiated; 8-character OTP required');
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { challengeId, otpCode } = req.body;
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await authService.verifyOtp(challengeId, otpCode, ip, userAgent);

      // Set HttpOnly, SameSite, Secure cookie
      res.cookie('session_token', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: result.expiresAt,
        path: '/',
      });

      return sendSuccess(res, result, 'Authentication successful');
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { challengeId } = req.body;
      const result = await authService.resendOtp(challengeId);
      return sendSuccess(res, result, 'Verification code resent successfully');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.sessionToken) {
        await authService.logout(req.sessionToken);
      }
      res.clearCookie('session_token', { path: '/' });
      return sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await authService.logoutAll(req.user.id);
      }
      res.clearCookie('session_token', { path: '/' });
      return sendSuccess(res, null, 'All sessions revoked successfully');
    } catch (error) {
      next(error);
    }
  }

  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendSuccess(res, { authenticated: false });
      }

      // Compute XP balance if Elite
      let xpBalance = 0;
      let rank = null;
      if (req.user.role === 'ELITE') {
        const xpAcct = db.xpAccounts.get(req.user.id);
        xpBalance = xpAcct?.currentBalance || 0;
      }

      return sendSuccess(res, {
        authenticated: true,
        user: {
          ...req.user,
          xpBalance,
          rank,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
