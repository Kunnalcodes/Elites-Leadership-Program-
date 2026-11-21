import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors.js';
import { sendError } from '../shared/utils.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  // Generic unhandled exception
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error occurred' 
    : err.message || 'Unexpected server error';

  return sendError(res, message, 500, 'INTERNAL_SERVER_ERROR', (err as any).stack);
}
