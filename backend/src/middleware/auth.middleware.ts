import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { UserModel } from '../models/user.model.js';
import { logger } from '../utils/logger.js';

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.session?.userId;

  if (!userId) {
    const response: ApiResponse = {
      success: false,
      message: 'Authentication required. No active session found.',
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: 'No valid authentication session found',
      },
    };
    res.status(401).json(response);
    return;
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      // Session exists but user account was removed
      req.session.destroy(() => {});
      const response: ApiResponse = {
        success: false,
        message: 'Authenticated user account no longer exists.',
        data: null,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User account not found',
        },
      };
      res.status(401).json(response);
      return;
    }

    req.user = {
      id: user._id.toString(),
      name: user.name || '',
      phone: user.phone || '',
      email: user.email,
      emailNormalized: user.emailNormalized,
    };

    next();
  } catch (error) {
    logger.error('Error verifying user session in requireAuth', { error });
    next(error);
  }
}

