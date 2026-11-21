import { ENV } from '../../config/env.js';

let prismaInstance: any = null;
let isDbConnected = false;
let lastDbError: string | null = null;

export async function getPrismaClient(): Promise<any> {
  if (!prismaInstance) {
    try {
      const prismaModule = await import('@prisma/client');
      const PrismaClientClass = (prismaModule as any).PrismaClient || (prismaModule as any).default?.PrismaClient;
      if (!PrismaClientClass) {
        lastDbError = 'Prisma Client not generated. In-memory authoritative data store active.';
        return null;
      }
      const adapterModule = await import('@prisma/adapter-pg').catch(() => null);
      if (adapterModule && (adapterModule as any).PrismaPg) {
        const adapter = new (adapterModule as any).PrismaPg({ connectionString: ENV.DATABASE_URL });
        prismaInstance = new PrismaClientClass({ adapter });
      } else {
        prismaInstance = new PrismaClientClass({ datasources: { db: { url: ENV.DATABASE_URL } } });
      }
    } catch (err: any) {
      lastDbError = err?.message || 'Prisma client not generated or unconfigured';
      return null;
    }
  }
  return prismaInstance;
}

export async function checkPrismaHealth(): Promise<{ isHealthy: boolean; error: string | null }> {
  try {
    const client = await getPrismaClient();
    if (!client) {
      return { isHealthy: false, error: lastDbError || 'In-memory authoritative store active' };
    }
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
