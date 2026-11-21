import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import rolesRoutes from './modules/roles/roles.routes.js';
import promotionsRoutes from './modules/promotions/promotions.routes.js';
import tasksRoutes from './modules/tasks/tasks.routes.js';
import submissionsRoutes from './modules/submissions/submissions.routes.js';
import gradingRoutes from './modules/grading/grading.routes.js';
import xpRoutes from './modules/xp/xp.routes.js';
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes.js';
import announcementsRoutes from './modules/announcements/announcements.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import messagingRoutes from './modules/messaging/messaging.routes.js';
import mentorsRoutes from './modules/mentors/mentors.routes.js';
import crmRoutes from './modules/crm/crm.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import auditRoutes from './modules/audit/audit.routes.js';
import filesRoutes from './modules/files/files.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Allow client development
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (same-origin, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        origin === ENV.CORS_ORIGIN ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  app.use(cookieParser(ENV.SESSION_SECRET));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'UP',
      service: 'Thread Elite Core Backend Engine',
      timestamp: new Date().toISOString(),
    });
  });

  // OpenAPI Documentation
  app.get(['/api-docs', '/api/v1/docs'], async (req, res) => {
    const fs = await import('fs/promises');
    const path = await import('path');
    const docPath = path.resolve(process.cwd(), 'server/src/docs/openapi.json');
    try {
      const data = await fs.readFile(docPath, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    } catch {
      res.json({ title: 'Thread Elite Core Program Management API', version: '1.0.0' });
    }
  });

  // Mount API v1 domain routes
  const apiV1 = express.Router();

  apiV1.use('/auth', authRoutes);
  apiV1.use('/users', usersRoutes);
  apiV1.use('/', rolesRoutes);
  apiV1.use('/', promotionsRoutes);
  apiV1.use('/tasks', tasksRoutes);
  apiV1.use('/', submissionsRoutes);
  apiV1.use('/', gradingRoutes);
  apiV1.use('/xp', xpRoutes);
  apiV1.use('/leaderboards', leaderboardRoutes);
  apiV1.use('/announcements', announcementsRoutes);
  apiV1.use('/notifications', notificationsRoutes);
  apiV1.use('/', messagingRoutes);
  apiV1.use('/mentors', mentorsRoutes);
  apiV1.use('/crm', crmRoutes);
  apiV1.use('/analytics', analyticsRoutes);
  apiV1.use('/audit', auditRoutes);
  apiV1.use('/files', filesRoutes);
  apiV1.use('/settings', settingsRoutes);

  app.use('/api/v1', apiV1);

  // Central Error Handler for API routes
  app.use(errorHandler);

  // In production, serve compiled Vite frontend from 'dist' directory
  const distPath = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api') && req.path !== '/health') {
        return res.sendFile(path.join(distPath, 'index.html'));
      }
      next();
    });
  }

  return app;
}
