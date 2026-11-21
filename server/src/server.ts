import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { bootstrapSuperAdmin, bootstrapPlatformDefaults } from './infrastructure/database/seed.js';

async function startServer() {
  try {
    // 1. Execute initial Super Admin bootstrap
    const bootstrap = await bootstrapSuperAdmin();
    console.log(`[BOOTSTRAP] Super Admin: ${bootstrap.email} (Status: ${bootstrap.isNew ? 'INITIALIZED' : 'PRE-EXISTING'})`);

    // 2. Initialize platform default mentor, students, tasks, and submissions
    await bootstrapPlatformDefaults();
    console.log(`[BOOTSTRAP] Platform defaults & demo ecosystem seeded successfully.`);

    // 2. Initialize application
    const app = createApp();

    const server = app.listen(ENV.PORT, '0.0.0.0', () => {
      console.log(`================================================================`);
      console.log(`🚀 THREAD ELITE PROGRAM MANAGEMENT BACKEND OPERATIONAL`);
      console.log(`📡 Listening on: http://localhost:${ENV.PORT}`);
      console.log(`🛡️  Role-Based Access Control & Dual-Tier OTP Active`);
      console.log(`📦 Modular Monolith — API Version 1 at /api/v1`);
      console.log(`================================================================`);
    });

    const shutdown = () => {
      console.log('[SYSTEM] Gracefully terminating Thread Elite server...');
      server.close(() => {
        console.log('[SYSTEM] Server terminated gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[FATAL] Failed to start Thread Elite backend server:', error);
    process.exit(1);
  }
}

startServer();
