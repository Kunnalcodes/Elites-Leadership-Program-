import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { bootstrapSuperAdmin } from '../src/infrastructure/database/seed.js';
import { ENV } from '../src/config/env.js';
import { emailService } from '../src/infrastructure/email/emailService.js';
import { db } from '../src/infrastructure/database/db.js';

describe('3. Five Promotion Levels, Transactional Progression & 1-Year CRM', () => {
  const app = createApp();
  let saToken = '';
  let mentorToken = '';
  let mentorId = '';
  let eliteToken = '';
  let eliteId = '';

  beforeAll(async () => {
    ENV.NODE_ENV = 'test';
    await bootstrapSuperAdmin();

    // Login Super Admin
    await request(app)
      .post('/api/v1/auth/super-admin/login')
      .send({ email: ENV.SUPER_ADMIN_BOOTSTRAP_EMAIL, password: ENV.SUPER_ADMIN_BOOTSTRAP_PASSWORD });

    const saOtp = emailService.deliveryLogs[emailService.deliveryLogs.length - 1].payload.otpCode;
    const saChallenge = Array.from(db.otpChallenges.values()).pop();
    const saAuth = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({ challengeId: saChallenge.id, otpCode: saOtp });
    saToken = saAuth.body.data.sessionToken;

    // Create Mentor
    const mentorRes = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${saToken}`)
      .send({
        email: 'dr.elena@threadsecurity.com',
        fullName: 'Dr. Elena Rostova',
        role: 'MENTOR',
        initialPassword: 'MentorPassword2026!',
      });
    mentorId = mentorRes.body.data.userId;

    // Create Elite
    const eliteRes = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${saToken}`)
      .send({
        email: 'cadet.maya@threadsecurity.com',
        fullName: 'Maya Lin',
        role: 'ELITE',
        eliteId: 'ELITE-2026-003',
        initialPassword: 'CadetPassword2026!',
      });
    eliteId = eliteRes.body.data.userId;

    // Elite login
    await request(app)
      .post('/api/v1/auth/elite/login')
      .send({ eliteId: 'ELITE-2026-003', password: 'CadetPassword2026!' });
    const eliteOtp = emailService.deliveryLogs[emailService.deliveryLogs.length - 1].payload.otpCode;
    const eliteChallenge = Array.from(db.otpChallenges.values()).pop();
    const eliteAuth = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({ challengeId: eliteChallenge.id, otpCode: eliteOtp });
    eliteToken = eliteAuth.body.data.sessionToken;
  });

  it('A. Promotion Levels Discovery - Returns all 5 distinct configurable levels', async () => {
    const res = await request(app)
      .get('/api/v1/promotion-levels')
      .set('Authorization', `Bearer ${saToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    const names = res.body.data.map((l: any) => l.name);
    expect(names).toEqual(['Foundation', 'Catalyst', 'Pioneer', 'Apex', 'Legacy']);
  });

  it('B. Transactional Promotion - Super Admin promotes Elite and preserves historical records', async () => {
    const res = await request(app)
      .post(`/api/v1/elites/${eliteId}/promote`)
      .set('Authorization', `Bearer ${saToken}`)
      .send({
        targetLevelId: 'level-catalyst',
        reason: 'Outstanding threat analysis capstone and exemplary peer collaboration.',
        notes: 'Passed oral defense with distinction.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.previousLevel).toBe('Foundation');
    expect(res.body.data.newLevel).toBe('Catalyst');

    // Verify historical membership preservation in database
    const memberships = Array.from(db.eliteLevelMemberships.values()).filter(
      (m) => m.eliteId === eliteId
    );
    expect(memberships).toHaveLength(2);

    const foundationMem = memberships.find((m) => m.promotionLevelId === 'level-foundation');
    expect(foundationMem.isCurrent).toBe(false);
    expect(foundationMem.effectiveTo).toBeDefined();

    const catalystMem = memberships.find((m) => m.promotionLevelId === 'level-catalyst');
    expect(catalystMem.isCurrent).toBe(true);
  });

  it('C. Progression History Verification - Retrieves progression timeline', async () => {
    const res = await request(app)
      .get(`/api/v1/elites/${eliteId}/promotion-history`)
      .set('Authorization', `Bearer ${eliteToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].toLevelName).toBe('Catalyst');
  });

  it('D. Mentor Assignment & Communication - Mentorship query initiated and answered', async () => {
    // 1. Assign Mentor to Elite
    const assignRes = await request(app)
      .post('/api/v1/mentors/assign')
      .set('Authorization', `Bearer ${saToken}`)
      .send({ mentorId, eliteId, notes: 'Security research alignment' });

    expect(assignRes.status).toBe(200);

    // 2. Elite starts conversation thread
    const convRes = await request(app)
      .post('/api/v1/conversations')
      .set('Authorization', `Bearer ${eliteToken}`)
      .send({
        mentorId,
        title: 'Guidance on Kernel Privilege Escalation Defense',
        initialMessage: 'Dr. Elena, I would appreciate your insight on eBPF telemetry hooks.',
      });

    expect(convRes.status).toBe(201);
    expect(convRes.body.data.conversation.status).toBe('WAITING_FOR_MENTOR');

    const conversationId = convRes.body.data.conversation.id;

    // 3. Mentor replies
    const replyRes = await request(app)
      .post(`/api/v1/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${saToken}`) // Super Admin / Mentor authorized
      .send({
        body: 'Excellent focus, Maya. Look into Cilium Tetragon for real-time kernel observability.',
      });

    expect(replyRes.status).toBe(201);
  });

  it('E. Elite CRM 1-Year Timeline - Consolidates comprehensive lifecycle milestones', async () => {
    const res = await request(app)
      .get(`/api/v1/crm/elites/${eliteId}/timeline`)
      .set('Authorization', `Bearer ${saToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.elite.fullName).toBe('Maya Lin');
    expect(res.body.data.timeline.length).toBeGreaterThan(1);
    const eventTypes = res.body.data.timeline.map((t: any) => t.type);
    expect(eventTypes).toContain('ENROLLMENT');
    expect(eventTypes).toContain('PROMOTION');
  });
});
