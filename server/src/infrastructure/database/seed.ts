import { db } from './db.js';
import { ENV } from '../../config/env.js';
import { PasswordSecurity } from '../security/password.js';
import { ROLES } from '../../config/constants.js';
import { v4 as uuidv4 } from 'uuid';

export async function bootstrapSuperAdmin(): Promise<{ email: string; isNew: boolean }> {
  // Check if Super Admin already exists
  for (const user of db.users.values()) {
    if (user.role === ROLES.SUPER_ADMIN) {
      user.email = ENV.SUPER_ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
      user.secretKey = ENV.SUPER_ADMIN_SECRET_KEY;
      user.passkey = ENV.SUPER_ADMIN_PASSKEY;
      return { email: user.email, isNew: false };
    }
  }

  const superAdminId = uuidv4();
  const passwordHash = await PasswordSecurity.hash(ENV.SUPER_ADMIN_BOOTSTRAP_PASSWORD);

  const user = {
    id: superAdminId,
    email: ENV.SUPER_ADMIN_BOOTSTRAP_EMAIL.toLowerCase(),
    passwordHash,
    role: ROLES.SUPER_ADMIN,
    secretKey: ENV.SUPER_ADMIN_SECRET_KEY,
    passkey: ENV.SUPER_ADMIN_PASSKEY,
    status: 'ACTIVE',
    isEmailVerified: true,
    requiresPasswordReset: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.users.set(superAdminId, user);

  const profile = {
    id: uuidv4(),
    userId: superAdminId,
    fullName: ENV.SUPER_ADMIN_BOOTSTRAP_FULLNAME,
    phone: null,
    avatarUrl: '/avatars/superadmin.png',
    bio: 'Thread Elite Master Super Administrator',
    enrollmentStatus: 'ENROLLED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.userProfiles.set(superAdminId, profile);

  // Grant all permissions
  for (const perm of db.permissions.values()) {
    const assignId = uuidv4();
    db.userRoleAssignments.set(assignId, {
      id: assignId,
      userId: superAdminId,
      permissionId: perm.id,
      grantedBy: 'SYSTEM_BOOTSTRAP',
      createdAt: new Date(),
    });
  }

  db.recordAuditLog({
    actorId: superAdminId,
    actorEmail: user.email,
    actorRole: ROLES.SUPER_ADMIN,
    action: 'SUPER_ADMIN_BOOTSTRAP_COMPLETED',
    entity: 'User',
    entityId: superAdminId,
    reason: 'Initial system bootstrap from environment variables',
  });

  return { email: user.email, isNew: true };
}

export async function bootstrapPlatformDefaults(): Promise<void> {
  const defaultPassword = 'AdminPassword123!';
  const defaultPasswordHash = await PasswordSecurity.hash(defaultPassword);
  const elitePassword = 'ElitePass2026!';
  const elitePasswordHash = await PasswordSecurity.hash(elitePassword);

  // 1. Seed Task Mentor (Marcus Reynolds)
  const mentorId = 'usr-mentor-reynolds';
  if (!db.users.has(mentorId)) {
    db.users.set(mentorId, {
      id: mentorId,
      email: ENV.TASK_MENTOR_EMAIL,
      passwordHash: defaultPasswordHash,
      role: ROLES.ADMIN,
      secretKey: ENV.TASK_MENTOR_SECRET_KEY,
      passkey: ENV.TASK_MENTOR_PASSKEY,
      status: 'ACTIVE',
      isEmailVerified: true,
      requiresPasswordReset: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    db.userProfiles.set(mentorId, {
      id: uuidv4(),
      userId: mentorId,
      fullName: 'Marcus Reynolds',
      phone: '+91 98111 22334',
      avatarUrl: '/avatars/mentor.png',
      bio: 'Lead Security Mentor & Offensive Operations Specialist. 12+ years experience in vulnerability research and red teaming.',
      enrollmentStatus: 'ENROLLED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Assign Mentor Permissions
    for (const perm of db.permissions.values()) {
      const assignId = uuidv4();
      db.userRoleAssignments.set(assignId, {
        id: assignId,
        userId: mentorId,
        permissionId: perm.id,
        grantedBy: 'SYSTEM_BOOTSTRAP',
        createdAt: new Date(),
      });
    }
  } else {
    const mentor = db.users.get(mentorId);
    if (mentor) {
      mentor.email = ENV.TASK_MENTOR_EMAIL;
      mentor.secretKey = ENV.TASK_MENTOR_SECRET_KEY;
      mentor.passkey = ENV.TASK_MENTOR_PASSKEY;
    }
  }

  // 2. Seed 3 Elites
  const catalystLevelId = 'level-catalyst';
  const elitesData = [
    {
      id: 'usr-elite-001',
      email: 'dhiraj@threadsecurity.in',
      eliteId: 'ELITE-2026-001',
      fullName: 'Dhiraj Roy',
      university: 'IIT Kharagpur',
      xp: 2980,
      streak: 14,
      sublevel: 'Gold',
      bio: 'Security researcher specializing in memory corruption, reverse engineering, and defensive architecture.',
    },
    {
      id: 'usr-elite-002',
      email: 'piyush@threadsecurity.in',
      eliteId: 'ELITE-2026-002',
      fullName: 'Piyush Kumar',
      university: 'NIT Trichy',
      xp: 2840,
      streak: 11,
      sublevel: 'Silver',
      bio: 'Cloud security practitioner, cloud-native telemetry enthusiast, and container isolation researcher.',
    },
    {
      id: 'usr-elite-003',
      email: 'kalpana@threadsecurity.in',
      eliteId: 'ELITE-2026-003',
      fullName: 'Kalpana Sharma',
      university: 'BITS Pilani',
      xp: 2710,
      streak: 9,
      sublevel: 'Bronze',
      bio: 'Cryptographic protocol designer and web security analyst focused on zero-knowledge proofs and secure enclave systems.',
    },
  ];

  for (const e of elitesData) {
    if (!db.users.has(e.id)) {
      db.users.set(e.id, {
        id: e.id,
        email: e.email,
        passwordHash: elitePasswordHash,
        role: ROLES.ELITE,
        status: 'ACTIVE',
        isEmailVerified: true,
        requiresPasswordReset: false,
        streakDays: e.streak,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      db.userProfiles.set(e.id, {
        id: uuidv4(),
        userId: e.id,
        fullName: e.fullName,
        eliteId: e.eliteId,
        university: e.university,
        phone: '+91 98765 00000',
        avatarUrl: `/avatars/${e.eliteId.toLowerCase()}.png`,
        bio: e.bio,
        sublevel: e.sublevel,
        enrollmentStatus: 'ENROLLED',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Promotion level membership
      const memId = uuidv4();
      db.eliteLevelMemberships.set(memId, {
        id: memId,
        eliteId: e.id,
        promotionLevelId: catalystLevelId,
        sublevel: e.sublevel,
        isCurrent: true,
        earnedAt: new Date(),
      });

      // Mentor Assignment
      const mentorAssignId = uuidv4();
      db.mentorAssignments.set(mentorAssignId, {
        id: mentorAssignId,
        mentorId: mentorId,
        eliteId: e.id,
        status: 'ACTIVE',
        assignedAt: new Date(),
      });

      // XP Account
      db.xpAccounts.set(e.id, {
        id: uuidv4(),
        eliteId: e.id,
        currentBalance: e.xp,
        lifetimeEarned: e.xp,
        lifetimeDeducted: 0,
        updatedAt: new Date(),
      });
    } else {
      const existing = db.users.get(e.id);
      if (existing) {
        existing.email = e.email;
        existing.passwordHash = elitePasswordHash;
        existing.status = 'ACTIVE';
        const prof = db.userProfiles.get(e.id);
        if (prof) prof.eliteId = e.eliteId;
      }
    }
  }

  // 3. Seed Tasks
  const tasksData = [
    {
      id: 'task-001',
      title: 'Threat Modeling Architecture: Core Auth Subsystems',
      slug: 'threat-modeling-core-auth',
      description: 'Perform a comprehensive STRIDE threat modeling assessment on the dual-tier authentication architecture. Identify privilege escalation vectors, OTP replay windows, and session fixation vulnerabilities. Deliver a structured technical report with architectural mitigation recommendations.',
      programId: 'prog-thread-elite-default',
      promotionLevelId: catalystLevelId,
      format: 'WRITTEN_REPORT',
      category: 'Security Architecture',
      maxXP: 350,
      estimatedHours: 8,
      status: 'PUBLISHED',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-002',
      title: 'Defensive Engineering Lab: Reverse Proxy & WAF Hardening',
      slug: 'reverse-proxy-waf-hardening',
      description: 'Implement an isolated NGINX / Envoy reverse proxy configuration with strict rate limiting, TLS 1.3 ciphers, ModSecurity WAF rules, and mTLS verification. Package complete docker-compose.yml lab environment with automated validation tests.',
      programId: 'prog-thread-elite-default',
      promotionLevelId: catalystLevelId,
      format: 'FILE_UPLOAD',
      category: 'Engineering & Defense',
      maxXP: 500,
      estimatedHours: 12,
      status: 'PUBLISHED',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-003',
      title: 'Executive Briefing: Zero Trust & C-Suite Risk Strategy',
      slug: 'zero-trust-executive-briefing',
      description: 'Develop a 10-slide executive presentation translating zero-trust security architecture into business risk reduction for enterprise leadership. Focus on identity federation, micro-segmentation, and ROI.',
      programId: 'prog-thread-elite-default',
      promotionLevelId: catalystLevelId,
      format: 'PRESENTATION',
      category: 'Leadership & Strategy',
      maxXP: 400,
      estimatedHours: 6,
      status: 'PUBLISHED',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-004',
      title: 'Incident Response Simulation: Log Forensics & Memory Dump',
      slug: 'ir-simulation-log-forensics',
      description: 'Analyze forensic artifacts from an APT intrusion scenario. Extract C2 beacon indicators from memory dump using Volatility3, reconstruct timeline from auditd logs, and publish public GitHub analysis repo.',
      programId: 'prog-thread-elite-default',
      promotionLevelId: catalystLevelId,
      format: 'LINK_SUBMISSION',
      category: 'Incident Response',
      maxXP: 600,
      estimatedHours: 15,
      status: 'PUBLISHED',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const t of tasksData) {
    if (!db.tasks.has(t.id)) {
      db.tasks.set(t.id, t);
    }
  }

  // 4. Seed Submissions & Evaluations for Task 1
  const sub1Id = 'sub-001';
  if (!db.submissions.has(sub1Id)) {
    db.submissions.set(sub1Id, {
      id: sub1Id,
      taskId: 'task-001',
      eliteId: 'usr-elite-001',
      status: 'GRADED',
      currentVersion: 1,
      format: 'WRITTEN_REPORT',
      writtenContent: 'Comprehensive STRIDE threat modeling analysis of Thread Elite auth endpoints. Identified 3 high-risk vectors in OTP replay windows and proposed HMAC-SHA256 state binding.',
      repoUrl: 'https://github.com/dhirajroy/thread-elite-stride-auth',
      notes: 'Initial submission complete with architectural diagrams and mitigation proofs.',
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });

    const eval1Id = 'eval-001';
    db.evaluations.set(eval1Id, {
      id: eval1Id,
      submissionId: sub1Id,
      reviewerId: mentorId,
      score: 98,
      maxScore: 100,
      qualitativeFeedback: 'Exceptional architectural breakdown, Dhiraj. Your threat modeling breakdown of the timing attack surface on OTP verification and architectural mitigation using constant-time comparison was exemplary. Promotion trajectory is exceptional.',
      status: 'PUBLISHED',
      xpAwarded: 350,
      evaluatedAt: new Date(),
      createdAt: new Date(),
    });

    db.taskAssignments.set('assign-001', {
      id: 'assign-001',
      taskId: 'task-001',
      eliteId: 'usr-elite-001',
      status: 'GRADED',
      submissionId: sub1Id,
      assignedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  // Submissions for Piyush & Kalpana
  const sub2Id = 'sub-002';
  if (!db.submissions.has(sub2Id)) {
    db.submissions.set(sub2Id, {
      id: sub2Id,
      taskId: 'task-001',
      eliteId: 'usr-elite-002',
      status: 'UNDER_REVIEW',
      currentVersion: 1,
      format: 'WRITTEN_REPORT',
      writtenContent: 'Analysis of session fixation and multi-device token revocation across distributed edge nodes.',
      repoUrl: 'https://github.com/piyush-kumar/auth-stride-report',
      notes: 'Submitted for mentor review.',
      submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });

    db.taskAssignments.set('assign-002', {
      id: 'assign-002',
      taskId: 'task-001',
      eliteId: 'usr-elite-002',
      status: 'SUBMITTED',
      submissionId: sub2Id,
      assignedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  const sub3Id = 'sub-003';
  if (!db.submissions.has(sub3Id)) {
    db.submissions.set(sub3Id, {
      id: sub3Id,
      taskId: 'task-001',
      eliteId: 'usr-elite-003',
      status: 'REVISION_REQUESTED',
      currentVersion: 1,
      format: 'WRITTEN_REPORT',
      writtenContent: 'Cryptographic boundary analysis for OTP hash derivation.',
      notes: 'Initial submission.',
      revisionReason: 'Strong cryptographic foundation, but Section 3 lacks specific attack trees for distributed brute-force attacks against the OTP window. Please expand and resubmit.',
      submittedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });

    db.taskAssignments.set('assign-003', {
      id: 'assign-003',
      taskId: 'task-001',
      eliteId: 'usr-elite-003',
      status: 'REVISION_REQUESTED',
      submissionId: sub3Id,
      assignedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  // 5. Seed Announcements
  const ann1Id = 'ann-001';
  if (!db.announcements.has(ann1Id)) {
    db.announcements.set(ann1Id, {
      id: ann1Id,
      title: 'Cohort Sprint 04: Advanced Cryptographic Verification & Leadership Assessment',
      content: 'All Elites in Level 1 Catalyst are required to complete Task 001 and review Task 002 prior to our live architectural review session with Marcus Reynolds this Thursday at 18:00 IST.',
      priority: 'URGENT',
      audienceType: 'ALL',
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    db.announcements.set('ann-002', {
      id: 'ann-002',
      title: 'Upcoming Masterclass: Marcus Reynolds on Offensive Tradecraft & Autonomous Red Teaming',
      content: 'Join us for an exclusive deep dive into automated exploit generation, kernel memory corruption, and bypassing modern EDR telemetry.',
      priority: 'NORMAL',
      audienceType: 'ALL',
      isPublished: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // 6. Seed Conversation between Marcus and Dhiraj
  const convId = 'conv-001';
  if (!db.conversations.has(convId)) {
    db.conversations.set(convId, {
      id: convId,
      mentorId: mentorId,
      eliteId: 'usr-elite-001',
      title: 'STRIDE Threat Model Feedback & Guidance',
      status: 'OPEN',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });

    db.messages.set('msg-001', {
      id: 'msg-001',
      conversationId: convId,
      senderId: 'usr-elite-001',
      senderRole: ROLES.ELITE,
      body: 'Hi Marcus, I have completed the STRIDE analysis for the auth endpoints. Would love your thoughts on my proposed mitigation for the OTP challenge timing attack.',
      createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
    });

    db.messages.set('msg-002', {
      id: 'msg-002',
      conversationId: convId,
      senderId: mentorId,
      senderRole: ROLES.ADMIN,
      body: 'Dhiraj, your analysis of constant-time buffer comparisons was spot-on. The grade and 350 XP award have been published to your ledger. Keep up the high standard.',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    });
  }
}
