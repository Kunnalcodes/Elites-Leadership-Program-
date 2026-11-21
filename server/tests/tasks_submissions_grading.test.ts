import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { bootstrapSuperAdmin } from '../src/infrastructure/database/seed.js';
import { ENV } from '../src/config/env.js';
import { emailService } from '../src/infrastructure/email/emailService.js';

describe('2. Tasks, Submissions, Rubric Grading & XP Ledger Engine', () => {
  const app = createApp();
  let adminToken = '';
  let eliteToken = '';
  let eliteId = '';
  let taskId = '';
  let submissionId = '';
  let evaluationId = '';

  beforeAll(async () => {
    ENV.NODE_ENV = 'test';
    await bootstrapSuperAdmin();

    // 1. Login Super Admin to provision Admin & Elite
    await request(app)
      .post('/api/v1/auth/super-admin/login')
      .send({
        email: ENV.SUPER_ADMIN_BOOTSTRAP_EMAIL,
        password: ENV.SUPER_ADMIN_BOOTSTRAP_PASSWORD,
      });

    const saOtp = emailService.deliveryLogs[emailService.deliveryLogs.length - 1].payload.otpCode;
    const saChallengeId = emailService.deliveryLogs[emailService.deliveryLogs.length - 1].payload.otpCode;
    // Get last challenge
    const { db } = await import('../src/infrastructure/database/db.js');
    const lastChallenge = Array.from(db.otpChallenges.values()).pop();

    const saAuth = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({ challengeId: lastChallenge.id, otpCode: saOtp });

    const saToken = saAuth.body.data.sessionToken;

    // 2. Create Task Master Admin
    await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${saToken}`)
      .send({
        email: 'taskmaster@threadsecurity.com',
        fullName: 'Marcus Task Master',
        role: 'ADMIN',
        initialPassword: 'AdminPassword2026!',
        permissions: ['tasks:create', 'tasks:publish', 'grading:evaluate', 'grading:publish', 'xp:award'],
      });

    // 3. Login Admin
    const adminLoginRes = await request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'taskmaster@threadsecurity.com',
        password: 'AdminPassword2026!',
      });

    const adminOtp = emailService.deliveryLogs[emailService.deliveryLogs.length - 1].payload.otpCode;
    const adminChallenge = Array.from(db.otpChallenges.values()).pop();
    const adminAuth = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({ challengeId: adminChallenge.id, otpCode: adminOtp });

    adminToken = adminAuth.body.data.sessionToken;

    // 4. Create Elite
    const eliteRes = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${saToken}`)
      .send({
        email: 'cadet.smith@threadsecurity.com',
        fullName: 'Jordan Smith',
        role: 'ELITE',
        eliteId: 'ELITE-2026-002',
        initialPassword: 'CadetPassword2026!',
      });
    eliteId = eliteRes.body.data.userId;

    // 5. Login Elite
    await request(app)
      .post('/api/v1/auth/elite/login')
      .send({ eliteId: 'ELITE-2026-002', password: 'CadetPassword2026!' });

    const eliteOtp = emailService.deliveryLogs[emailService.deliveryLogs.length - 1].payload.otpCode;
    const eliteChallenge = Array.from(db.otpChallenges.values()).pop();
    const eliteAuth = await request(app)
      .post('/api/v1/auth/otp/verify')
      .send({ challengeId: eliteChallenge.id, otpCode: eliteOtp });

    eliteToken = eliteAuth.body.data.sessionToken;
  });

  it('A. Task Creation - Admin creates task with rubric and targeting', async () => {
    const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Zero Trust Network Architecture Audit',
        shortDescription: 'Audit perimeter configurations and draft migration manifesto.',
        instructions: 'Analyze the simulated cloud topology. Propose least-privilege IAM policies and segmentation.',
        objectives: ['Identify unauthenticated ingress', 'Formulate Zero Trust architecture'],
        category: 'SECURITY_ARCHITECTURE',
        difficulty: 'ADVANCED',
        taskFormat: ['WRITTEN_RESPONSE', 'PDF_SUBMISSION', 'GITHUB_REPOSITORY_URL'],
        maxXP: 250,
        submissionDeadline: deadline,
        targetType: 'ALL',
        targetValue: '*',
        resources: [
          { title: 'NIST SP 800-207 Specification', url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final', resourceType: 'DOCS', isRequired: true },
        ],
        rubricCriteria: [
          { title: 'Threat Vector Identification', maxScore: 50 },
          { title: 'Architectural Soundness', maxScore: 30 },
          { title: 'Clarity of Delivery', maxScore: 20 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Zero Trust Network Architecture Audit');
    expect(res.body.data.taskCode).toBeDefined();
    expect(res.body.data.rubric.criteria).toHaveLength(3);

    taskId = res.body.data.id;
  });

  it('B. Task Publishing - Distributes assignment to eligible Elites', async () => {
    const res = await request(app)
      .post(`/api/v1/tasks/${taskId}/publish`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('PUBLISHED');
    expect(res.body.data.assignedCount).toBeGreaterThan(0);
  });

  it('C. Submission Flow - Elite submits response and receives receipt reference', async () => {
    const res = await request(app)
      .post(`/api/v1/tasks/${taskId}/submissions`)
      .set('Authorization', `Bearer ${eliteToken}`)
      .send({
        textResponse: 'Comprehensive Zero Trust architecture with micro-segmentation and mutual TLS.',
        links: [{ label: 'GitHub Repository', url: 'https://github.com/thread-security/zt-audit-spec' }],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.receiptReference).toMatch(/^SUB-/);
    expect(res.body.data.versionNumber).toBe(1);
    expect(res.body.data.status).toBe('SUBMITTED');

    submissionId = res.body.data.submissionId;
  });

  it('D. Submission Versioning - Resubmission increments version immutably', async () => {
    const res = await request(app)
      .post(`/api/v1/tasks/${taskId}/submissions`)
      .set('Authorization', `Bearer ${eliteToken}`)
      .send({
        textResponse: 'Version 2 updated with automated perimeter firewall diagrams.',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.versionNumber).toBe(2);
    expect(res.body.data.status).toBe('RESUBMITTED');
  });

  it('E. Evaluation & Grading - Admin grades work using rubric criteria', async () => {
    const taskDetails = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    const criteria = taskDetails.body.data.rubric.criteria;

    const res = await request(app)
      .post(`/api/v1/submissions/${submissionId}/evaluate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        versionNumber: 2,
        criteriaScores: [
          { criterionId: criteria[0].id, score: 48, feedback: 'Superb vector analysis.' },
          { criterionId: criteria[1].id, score: 28, feedback: 'Robust architecture.' },
          { criterionId: criteria[2].id, score: 20, feedback: 'Flawless formatting.' },
        ],
        generalFeedback: 'Exceptional defense presentation.',
        isDraft: false, // Auto-publishes
      });

    expect(res.status).toBe(200);
    expect(res.body.data.totalScore).toBe(96);
    expect(res.body.data.isPublished).toBe(true);

    evaluationId = res.body.data.evaluationId;
  });

  it('F. XP Ledger Integrity - XP is posted to double-entry ledger with idempotency', async () => {
    const res = await request(app)
      .get(`/api/v1/xp/transactions?eliteId=${eliteId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);

    const taskTx = res.body.data.find((tx: any) => tx.taskId === taskId);
    expect(taskTx).toBeDefined();
    expect(taskTx.amount).toBeGreaterThan(0);
    expect(taskTx.idempotencyKey).toBeDefined();
  });

  it('G. Leaderboard & Top Three - Recalculates standings based on verified XP', async () => {
    const res = await request(app)
      .get('/api/v1/leaderboards/top-three')
      .set('Authorization', `Bearer ${eliteToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.topThree).toBeDefined();
    expect(res.body.data.champion).toBeDefined();
  });
});
