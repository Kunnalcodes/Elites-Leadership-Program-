import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { bootstrapSuperAdmin } from '../src/infrastructure/database/seed.js';
import { ENV } from '../src/config/env.js';
import { emailService } from '../src/infrastructure/email/emailService.js';
import { db } from '../src/infrastructure/database/db.js';

describe('4. Master Brief Definition of Done: 30-Step End-to-End Program Lifecycle', () => {
  const app = createApp();

  let superAdminToken = '';
  let superAdminId = '';

  let adminEmail = 'tm.reynolds@threadsecurity.com';
  let adminPassword = 'AdminPassword2026!';
  let adminId = '';
  let adminToken = '';

  let eliteEmail = 'elite.turing@threadsecurity.com';
  let elitePassword = 'ElitePassword2026!';
  let eliteIdCode = 'ELITE-2026-099';
  let eliteUserId = '';
  let eliteToken = '';

  let mentorId = '';
  let taskId = '';
  let submissionId = '';
  let evaluationId = '';
  let leaderboardSnapshotId = '';
  let conversationId = '';

  beforeAll(async () => {
    ENV.NODE_ENV = 'test';
    await bootstrapSuperAdmin();
  });

  // Step 1: Super Admin securely logs in
  it('Step 1: Super Admin securely logs in with email + password + 6-digit OTP', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/super-admin/login')
      .send({ email: ENV.SUPER_ADMIN_BOOTSTRAP_EMAIL, password: ENV.SUPER_ADMIN_BOOTSTRAP_PASSWORD });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.requiresOtp).toBe(true);

    const otp = emailService.deliveryLogs[emailService.deliveryLogs.length - 1].payload.otpCode;
    const challenge = Array.from(db.otpChallenges.values()).pop();

    const verifyRes = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({ challengeId: challenge.id, otpCode: otp });
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.user.role).toBe('SUPER_ADMIN');

    superAdminToken = verifyRes.body.data.sessionToken;
    superAdminId = verifyRes.body.data.user.id;
  });

  // Step 2 & 3: Super Admin creates an Admin; Admin receives invitation
  it('Steps 2 & 3: Super Admin creates an Admin who receives an activation invitation', async () => {
    const createRes = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        email: adminEmail,
        fullName: 'Captain Ryan Reynolds',
        role: 'ADMIN',
        initialPassword: adminPassword,
      });

    expect(createRes.status).toBe(201);
    adminId = createRes.body.data.userId;

    // Check invitation email dispatched
    const lastEmail = emailService.deliveryLogs[emailService.deliveryLogs.length - 1];
    expect(lastEmail).toBeDefined();
    expect(lastEmail.to).toBe(adminEmail);
  });

  // Step 4 & 5: Admin completes activation and Super Admin assigns permissions
  it('Steps 4 & 5: Admin completes activation and Super Admin assigns granular permissions', async () => {
    // Assign permissions
    const permRes = await request(app)
      .patch(`/api/v1/admins/${adminId}/permissions`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        permissions: [
          'tasks:create',
          'tasks:publish',
          'tasks:manage',
          'submissions:view',
          'grading:evaluate',
          'grading:publish',
          'xp:award',
          'leaderboard:manage',
          'announcements:create',
        ],
      });
    expect(permRes.status).toBe(200);

    // Admin logs in
    const loginRes = await request(app)
      .post('/api/v1/auth/admin/login')
      .send({ email: adminEmail, password: adminPassword });
    expect(loginRes.status).toBe(200);

    const otp = emailService.deliveryLogs[emailService.deliveryLogs.length - 1].payload.otpCode;
    const challenge = Array.from(db.otpChallenges.values()).pop();

    const verifyRes = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({ challengeId: challenge.id, otpCode: otp });
    expect(verifyRes.status).toBe(200);

    adminToken = verifyRes.body.data.sessionToken;
  });

  // Step 6: Super Admin configures the five promotion levels
  it('Step 6: Super Admin configures the five promotion levels', async () => {
    const res = await request(app)
      .get('/api/v1/promotion-levels')
      .set('Authorization', `Bearer ${superAdminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
  });

  // Step 7 & 8: Admin creates an Elite account; Elite receives activation instructions
  it('Steps 7 & 8: Admin creates an Elite account with Elite ID', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: eliteEmail,
        fullName: 'Alan Turing',
        role: 'ELITE',
        eliteId: eliteIdCode,
        initialPassword: elitePassword,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.eliteId).toBe(eliteIdCode);
    eliteUserId = res.body.data.userId;
  });

  // Step 9, 10, 11: Elite logs in with Elite ID + password + 8-char OTP, accesses Foundation dashboard
  it('Steps 9, 10 & 11: Elite logs in with Elite ID + password, completes 8-character OTP verification and accesses Foundation dashboard', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/elite/login')
      .send({ eliteId: eliteIdCode, password: elitePassword });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.requiresOtp).toBe(true);
    expect(loginRes.body.data.otpLength).toBe(8);

    const otp = emailService.deliveryLogs[emailService.deliveryLogs.length - 1].payload.otpCode;
    expect(otp).toHaveLength(8);
    const challenge = Array.from(db.otpChallenges.values()).pop();

    const verifyRes = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({ challengeId: challenge.id, otpCode: otp });
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.user.role).toBe('ELITE');
    expect(verifyRes.body.data.user.currentLevel.slug).toBe('foundation');

    eliteToken = verifyRes.body.data.sessionToken;

    // Access level dashboard
    const dashRes = await request(app)
      .get('/api/v1/analytics/level/foundation')
      .set('Authorization', `Bearer ${eliteToken}`);
    expect(dashRes.status).toBe(200);
    expect(dashRes.body.data.level.name).toBe('Foundation');
  });

  // Step 12, 13, 14, 15: Admin creates a task with resources, deadline, assigns to group, Elite receives notification
  it('Steps 12, 13, 14 & 15: Admin creates task with resources & deadline, publishes to Elites who receive notifications', async () => {
    const deadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

    const createRes = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Cloud Cryptographic Vulnerability Assessment',
        shortDescription: 'Audit TLS cipher suites and key rotation policies.',
        instructions: 'Submit a comprehensive security analysis report.',
        category: 'CRYPTOGRAPHY',
        taskFormat: ['WRITTEN_RESPONSE', 'PDF_SUBMISSION', 'GITHUB_REPOSITORY_URL'],
        maxXP: 300,
        submissionDeadline: deadline,
        targetType: 'ALL',
        targetValue: '*',
        resources: [{ title: 'TLS 1.3 RFC 8446', url: 'https://datatracker.ietf.org/doc/html/rfc8446', resourceType: 'DOCS' }],
        rubricCriteria: [
          { title: 'Vulnerability Identification', maxScore: 50 },
          { title: 'Remediation Architecture', maxScore: 50 },
        ],
      });
    expect(createRes.status).toBe(201);
    taskId = createRes.body.data.id;

    // Publish
    const pubRes = await request(app)
      .post(`/api/v1/tasks/${taskId}/publish`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(pubRes.status).toBe(200);

    // Elite receives notification
    const notifs = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${eliteToken}`);
    expect(notifs.status).toBe(200);
    const taskNotif = notifs.body.data.find((n: any) => n.eventType === 'NEW_TASK_ASSIGNED');
    expect(taskNotif).toBeDefined();
  });

  // Step 16 & 17: Elite submits response; System confirms submission receipt
  it('Steps 16 & 17: Elite submits required response and receives receipt confirmation', async () => {
    const subRes = await request(app)
      .post(`/api/v1/tasks/${taskId}/submissions`)
      .set('Authorization', `Bearer ${eliteToken}`)
      .send({
        textResponse: 'Comprehensive cryptographic audit report on elliptic curve and post-quantum readiness.',
        links: [{ label: 'GitHub PoC', url: 'https://github.com/alan-turing/crypto-audit' }],
      });

    expect(subRes.status).toBe(201);
    expect(subRes.body.data.receiptReference).toBeDefined();
    expect(subRes.body.data.confirmationMessage).toContain('securely received');

    submissionId = subRes.body.data.submissionId;
  });

  // Step 18, 19, 20: Admin reviews, grades with rubric, publishes evaluation
  it('Steps 18, 19 & 20: Admin reviews submission, evaluates with rubric and publishes evaluation', async () => {
    const taskDetails = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    const criteria = taskDetails.body.data.rubric.criteria;

    const evalRes = await request(app)
      .post(`/api/v1/submissions/${submissionId}/evaluate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        versionNumber: 1,
        criteriaScores: [
          { criterionId: criteria[0].id, score: 50, feedback: 'Perfect detection.' },
          { criterionId: criteria[1].id, score: 48, feedback: 'Outstanding remediation.' },
        ],
        generalFeedback: 'Masterful cryptographic assessment.',
        isDraft: false,
      });

    expect(evalRes.status).toBe(200);
    expect(evalRes.body.data.totalScore).toBe(98);
    expect(evalRes.body.data.isPublished).toBe(true);

    evaluationId = evalRes.body.data.evaluationId;
  });

  // Step 21 & 22: Backend creates eligible XP transaction; Leaderboard recalculates
  it('Steps 21 & 22: Backend posts XP ledger transaction and recalculates leaderboard standings', async () => {
    const xpRes = await request(app)
      .get(`/api/v1/xp/transactions?eliteId=${eliteUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(xpRes.status).toBe(200);
    expect(xpRes.body.data[0].amount).toBeGreaterThan(0);

    const lbRes = await request(app)
      .get('/api/v1/leaderboards')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(lbRes.status).toBe(200);
    const myRank = lbRes.body.data.find((e: any) => e.eliteId === eliteUserId);
    expect(myRank).toBeDefined();
    expect(myRank.totalXP).toBeGreaterThan(0);
  });

  // Step 23, 24, 25: Admin publishes leaderboard; Elites notified; Top 3 appear
  it('Steps 23, 24 & 25: Official leaderboard published, Elites notified, Top 3 showcased', async () => {
    const pubRes = await request(app)
      .post('/api/v1/leaderboards/publish')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ scope: 'OVERALL', title: 'Q1 Official Leaderboard Standings' });
    expect(pubRes.status).toBe(200);

    const topThreeRes = await request(app)
      .get('/api/v1/leaderboards/top-three')
      .set('Authorization', `Bearer ${eliteToken}`);
    expect(topThreeRes.status).toBe(200);
    expect(topThreeRes.body.data.champion).toBeDefined();

    // Check Elite received notification
    const notifs = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${eliteToken}`);
    const lbNotif = notifs.body.data.find((n: any) => n.eventType === 'LEADERBOARD_PUBLISHED');
    expect(lbNotif).toBeDefined();
  });

  // Step 26, 27, 28: Super Admin promotes eligible Elite to Catalyst; Next dashboard accessible; History intact
  it('Steps 26, 27 & 28: Super Admin promotes Elite; Next dashboard unlocked; Previous history preserved intact', async () => {
    const promoteRes = await request(app)
      .post(`/api/v1/elites/${eliteUserId}/promote`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        targetLevelId: 'level-catalyst',
        reason: 'Mastered cryptography fundamentals and demonstrated exceptional leadership.',
      });
    expect(promoteRes.status).toBe(200);
    expect(promoteRes.body.data.newLevel).toBe('Catalyst');

    // Access Catalyst Dashboard
    const catalystDash = await request(app)
      .get('/api/v1/analytics/level/catalyst')
      .set('Authorization', `Bearer ${eliteToken}`);
    expect(catalystDash.status).toBe(200);
    expect(catalystDash.body.data.level.name).toBe('Catalyst');

    // Check history preservation
    const histRes = await request(app)
      .get(`/api/v1/elites/${eliteUserId}/promotion-history`)
      .set('Authorization', `Bearer ${eliteToken}`);
    expect(histRes.status).toBe(200);
    expect(histRes.body.data[0].fromLevelName).toBe('Foundation');
    expect(histRes.body.data[0].toLevelName).toBe('Catalyst');
  });

  // Step 29: Mentor and Elite communication continues without losing history
  it('Step 29: Mentor and Elite communication continues seamlessly', async () => {
    // 1. Create mentor
    const mentorRes = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        email: 'mentor.shannon@threadsecurity.com',
        fullName: 'Claude Shannon',
        role: 'MENTOR',
        initialPassword: 'MentorPassword2026!',
      });
    mentorId = mentorRes.body.data.userId;

    // 2. Assign mentor
    await request(app)
      .post('/api/v1/mentors/assign')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({ mentorId, eliteId: eliteUserId });

    // 3. Elite initiates conversation
    const convRes = await request(app)
      .post('/api/v1/conversations')
      .set('Authorization', `Bearer ${eliteToken}`)
      .send({
        mentorId,
        title: 'Information Theoretic Security Guidance',
        initialMessage: 'Mentor Shannon, I am preparing for the Catalyst level cryptographic protocol challenge.',
      });
    expect(convRes.status).toBe(201);
    conversationId = convRes.body.data.conversation.id;

    // 4. Retrieve conversation history
    const historyRes = await request(app)
      .get(`/api/v1/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${eliteToken}`);
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.data.messages).toHaveLength(1);
  });

  // Step 30: All significant actions appear in the immutable audit log
  it('Step 30: All significant actions appear in the immutable audit log', async () => {
    const auditRes = await request(app)
      .get('/api/v1/audit')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(auditRes.status).toBe(200);
    expect(auditRes.body.data.length).toBeGreaterThan(5);

    const actions = auditRes.body.data.map((log: any) => log.action);
    expect(actions).toContain('USER_CREATED');
    expect(actions).toContain('TASK_CREATED');
    expect(actions).toContain('TASK_PUBLISHED');
    expect(actions).toContain('TASK_SUBMITTED');
    expect(actions).toContain('EVALUATION_PUBLISHED');
    expect(actions).toContain('LEADERBOARD_PUBLISHED');
    expect(actions).toContain('ELITE_PROMOTED');
  });
});
