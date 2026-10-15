import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  logger.error('Unhandled server error', {
    error: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  const response: ApiResponse = {
    success: false,
    message: 'An internal error occurred. Please try again later.',
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'development' ? err.message : 'An internal error occurred.',
    },
  };

  res.status(500).json(response);
}

