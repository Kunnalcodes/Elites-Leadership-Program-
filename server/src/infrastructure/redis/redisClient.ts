import { Redis } from 'ioredis';
import { ENV } from '../../config/env.js';

let redisClient: Redis | null = null;
let isRedisConnected = false;
let lastRedisError: string | null = null;

// In-memory fallback cache
const memoryCache = new Map<string, { value: string; expiresAt?: number }>();

export function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  try {
    redisClient = new Redis(ENV.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true,
      retryStrategy: () => null, // Do not infinite retry in local dev
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      lastRedisError = null;
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      lastRedisError = err.message;
    });

    return redisClient;
  } catch (err: any) {
    isRedisConnected = false;
    lastRedisError = err.message;
    return null;
  }
}

export async function checkRedisHealth(): Promise<{ isHealthy: boolean; error: string | null }> {
  try {
    const client = getRedisClient();
    if (!client) {
      return { isHealthy: false, error: 'Redis client not initialized' };
    }
    if (client.status === 'wait' || client.status === 'close') {
      await client.connect();
    }
    await client.ping();
    isRedisConnected = true;
    lastRedisError = null;
    return { isHealthy: true, error: null };
  } catch (err: any) {
    isRedisConnected = false;
    lastRedisError = err?.message || 'Redis connection unreachable';
    return { isHealthy: false, error: lastRedisError };
  }
}

export const cacheStore = {
  async get(key: string): Promise<string | null> {
    if (isRedisConnected && redisClient) {
      try {
        return await redisClient.get(key);
      } catch {}
    }
    const item = memoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return item.value;
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (isRedisConnected && redisClient) {
      try {
        if (ttlSeconds) {
          await redisClient.set(key, value, 'EX', ttlSeconds);
        } else {
          await redisClient.set(key, value);
        }
        return;
      } catch {}
    }
    memoryCache.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  },

  async del(key: string): Promise<void> {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.del(key);
      } catch {}
    }
    memoryCache.delete(key);
  },
};
