import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../shared/errors.js';

interface RateLimitTracker {
  count: number;
  resetAt: number;
}

export function createSlidingRateLimiter(options: { windowMs: number; maxRequests: number; message?: string }) {
  const store = new Map<string, RateLimitTracker>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.headers['x-forwarded-for']?.toString() || 'anonymous';
    const now = Date.now();

    let tracker = store.get(key);
    if (!tracker || now > tracker.resetAt) {
      tracker = { count: 1, resetAt: now + options.windowMs };
      store.set(key, tracker);
      return next();
    }

    if (tracker.count >= options.maxRequests) {
      return next(new RateLimitError(options.message || 'Too many requests. Please wait and try again.'));
    }

    tracker.count += 1;
    next();
  };
}
