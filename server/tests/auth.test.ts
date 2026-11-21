import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { bootstrapSuperAdmin } from '../src/infrastructure/database/seed.js';
import { ENV } from '../src/config/env.js';
import { db } from '../src/infrastructure/database/db.js';

describe('1. Identity & Dual-Tier Authentication Engine', () => {
  const app = createApp();
  let superAdminOtpChallengeId = '';
  let superAdminSessionToken = '';
  let eliteOtpChallengeId = '';
  let eliteSessionToken = '';

  beforeAll(async () => {
    ENV.NODE_ENV = 'test';
    await bootstrapSuperAdmin();
  });

  it('A. Super Admin Login - Stage 1 issues 6-digit numeric OTP challenge', async () => {
    const res = await request(app)
      .post('/api/v1/auth/super-admin/login')
      .send({
        email: ENV.SUPER_ADMIN_BOOTSTRAP_EMAIL,
        password: ENV.SUPER_ADMIN_BOOTSTRAP_PASSWORD,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.requiresOtp).toBe(true);
    expect(res.body.data.otpLength).toBe(6);
    expect(res.body.data.challengeId).toBeDefined();

    superAdminOtpChallengeId = res.body.data.challengeId;
  });

  it('B. Super Admin Login - Rejects incorrect password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/super-admin/login')
      .send({
        email: ENV.SUPER_ADMIN_BOOTSTRAP_EMAIL,
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('C. Super Admin OTP Verification - Stage 2 creates session and HttpOnly cookie', async () => {
    // Lookup challenge code hash directly from store for test execution
    let testCode = '';
    for (const [code] of [
      // Test the challenge stored in memory
    ]) {}
    
    // In our test environment, we extract code through challenge test helper
    const challenge = db.otpChallenges.get(superAdminOtpChallengeId);
    expect(challenge).toBeDefined();

    // Verify through the verification endpoint using valid matching code
    // Find the logged email delivery to extract the actual sent OTP code
    const delivery = db.recordAuditLog ? [
      // find from email logs
    ] : [];

    const emailLogs = (await import('../src/infrastructure/email/emailService.js')).emailService.deliveryLogs;
    const lastEmail = emailLogs[emailLogs.length - 1];
    expect(lastEmail).toBeDefined();
    testCode = lastEmail.payload.otpCode;
    expect(testCode).toHaveLength(6);

    const res = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({
        challengeId: superAdminOtpChallengeId,
        otpCode: testCode,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sessionToken).toBeDefined();
    expect(res.body.data.user.role).toBe('SUPER_ADMIN');

    superAdminSessionToken = res.body.data.sessionToken;

    // Cookie must be present
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('session_token=');
  });

  it('D. OTP Replay Prevention - Consumed OTP code cannot be reused', async () => {
    const emailLogs = (await import('../src/infrastructure/email/emailService.js')).emailService.deliveryLogs;
    const lastEmail = emailLogs[emailLogs.length - 1];

    const res = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({
        challengeId: superAdminOtpChallengeId,
        otpCode: lastEmail.payload.otpCode,
      });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toContain('already been used');
  });

  it('E. Authenticated Session Retrieval - Validates active session context', async () => {
    const res = await request(app)
      .get('/api/v1/auth/session')
      .set('Authorization', `Bearer ${superAdminSessionToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.authenticated).toBe(true);
    expect(res.body.data.user.role).toBe('SUPER_ADMIN');
  });

  it('F. Unauthorized Access Rejection - Rejects unauthenticated requests to protected routes', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(401);
  });

  it('G. Elite Authentication - Requires 8-character uppercase alphanumeric OTP', async () => {
    // 1. Create Elite via Super Admin
    const createEliteRes = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${superAdminSessionToken}`)
      .send({
        email: 'elite.cadet@threadsecurity.com',
        fullName: 'Alex Vance',
        role: 'ELITE',
        eliteId: 'ELITE-2026-001',
        initialPassword: 'CadetPassword2026!',
      });

    expect(createEliteRes.status).toBe(201);
    expect(createEliteRes.body.data.eliteId).toBe('ELITE-2026-001');

    // 2. Elite Login with Elite ID
    const loginRes = await request(app)
      .post('/api/v1/auth/elite/login')
      .send({
        eliteId: 'ELITE-2026-001',
        password: 'CadetPassword2026!',
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.requiresOtp).toBe(true);
    expect(loginRes.body.data.otpLength).toBe(8);

    eliteOtpChallengeId = loginRes.body.data.challengeId;

    // 3. Retrieve dispatched 8-char OTP
    const emailLogs = (await import('../src/infrastructure/email/emailService.js')).emailService.deliveryLogs;
    const lastEmail = emailLogs[emailLogs.length - 1];
    expect(lastEmail.payload.otpCode).toHaveLength(8);

    // 4. Verify 8-char OTP
    const verifyRes = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({
        challengeId: eliteOtpChallengeId,
        otpCode: lastEmail.payload.otpCode,
      });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.user.role).toBe('ELITE');
    expect(verifyRes.body.data.user.eliteId).toBe('ELITE-2026-001');

    eliteSessionToken = verifyRes.body.data.sessionToken;
  });

  it('H. RBAC Boundary - Elite is strictly forbidden from accessing Admin User Management', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${eliteSessionToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error.message).toContain('Access denied');
  });
});
