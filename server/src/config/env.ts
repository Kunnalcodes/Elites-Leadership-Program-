import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/thread_elite?schema=public',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Thread Elite <elite@threadsecurity.com>',
  GCS_BUCKET: process.env.GCS_BUCKET || '',
  GCS_KEY_FILE: process.env.GCS_KEY_FILE || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'thread-elite-default-secret-key-32-chars-long-secure',
  SESSION_TTL_HOURS: parseInt(process.env.SESSION_TTL_HOURS || '24', 10),
  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Super Admin Bootstrap Credentials
  SUPER_ADMIN_BOOTSTRAP_EMAIL: process.env.SUPER_ADMIN_BOOTSTRAP_EMAIL || 'threadsecurity@gmail.com',
  SUPER_ADMIN_BOOTSTRAP_PASSWORD: process.env.SUPER_ADMIN_BOOTSTRAP_PASSWORD || 'SuperAdminPass2026!',
  SUPER_ADMIN_BOOTSTRAP_FULLNAME: process.env.SUPER_ADMIN_BOOTSTRAP_FULLNAME || 'System Master Super Admin',
  SUPER_ADMIN_SECRET_KEY: process.env.SUPER_ADMIN_SECRET_KEY || 'AdminKey2026!',
  SUPER_ADMIN_PASSKEY: process.env.SUPER_ADMIN_PASSKEY || 'AdminPass2026!',

  // Task Mentor Clearance Credentials
  TASK_MENTOR_EMAIL: process.env.TASK_MENTOR_EMAIL || 'mentor@threadsecurity.in',
  TASK_MENTOR_SECRET_KEY: process.env.TASK_MENTOR_SECRET_KEY || 'MentorKey2026!',
  TASK_MENTOR_PASSKEY: process.env.TASK_MENTOR_PASSKEY || 'MentorPass2026!',
};
