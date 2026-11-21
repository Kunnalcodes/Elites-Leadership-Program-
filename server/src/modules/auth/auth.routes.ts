import { Router } from 'express';
import { z } from 'zod';
import { authController } from './auth.controller.js';
import { validateBody } from '../../middleware/validate.js';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.js';
import { createSlidingRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Rate limiter for login endpoints: 10 attempts per minute
const authRateLimiter = createSlidingRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: 'Too many authentication attempts. Please try again after 1 minute.',
});

const superAdminLoginSchema = z.object({
  email: z.string().optional(),
  secretKey: z.string().optional(),
  password: z.string().optional(),
  passkey: z.string().optional(),
}).refine(data => (data.email || data.secretKey) && (data.password || data.passkey), {
  message: 'Identifier and credential required',
});

const adminLoginSchema = z.object({
  email: z.string().optional(),
  secretKey: z.string().optional(),
  password: z.string().optional(),
  passkey: z.string().optional(),
}).refine(data => (data.email || data.secretKey) && (data.password || data.passkey), {
  message: 'Identifier and credential required',
});

const eliteLoginSchema = z.object({
  eliteId: z.string().min(3),
  password: z.string().min(6),
});

const validateIdentitySchema = z.object({
  identifier: z.string().min(3),
});

const verifyOtpSchema = z.object({
  challengeId: z.string().uuid(),
  otpCode: z.string().min(6).max(8),
});

const resendOtpSchema = z.object({
  challengeId: z.string().uuid(),
});

router.post('/validate-identity', authRateLimiter, validateBody(validateIdentitySchema), authController.validateIdentity);
router.post('/super-admin/login', authRateLimiter, validateBody(superAdminLoginSchema), authController.superAdminLogin);
router.post('/admin/login', authRateLimiter, validateBody(adminLoginSchema), authController.adminLogin);
router.post('/elite/login', authRateLimiter, validateBody(eliteLoginSchema), authController.eliteLogin);
router.post('/otp/verify', authRateLimiter, validateBody(verifyOtpSchema), authController.verifyOtp);
router.post('/otp/resend', authRateLimiter, validateBody(resendOtpSchema), authController.resendOtp);

// Authenticated session routes
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/session', optionalAuthenticate, authController.getSession);

export default router;
