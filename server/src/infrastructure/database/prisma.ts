import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ENV } from '../../config/env.js';

let prismaInstance: PrismaClient | null = null;
let isDbConnected = false;
let lastDbError: string | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    const adapter = new PrismaPg({ connectionString: ENV.DATABASE_URL });
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

export async function checkPrismaHealth(): Promise<{ isHealthy: boolean; error: string | null }> {
  try {
    const client = getPrismaClient();
    await client.$queryRawUnsafe('SELECT 1');
    isDbConnected = true;
    lastDbError = null;
    return { isHealthy: true, error: null };
  } catch (err: any) {
    isDbConnected = false;
    lastDbError = err?.message || 'Database connection unreachable';
    return { isHealthy: false, error: lastDbError };
  }
}

export function isPrismaConnected(): boolean {
  return isDbConnected;
}
