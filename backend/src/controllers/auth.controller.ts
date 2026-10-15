import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { authService, AuthServiceError } from '../services/auth.service.js';
import {
  sendOtpSchema,
  verifyOtpSchema,
  resendOtpSchema,
  registerSchema,
  loginPasswordSchema,
} from '../validators/auth.validator.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class AuthController {
  /**
   * POST /api/auth/register
   * Registers a new parent account with full name, phone number, email, and password
   */
  async register(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        const response: ApiResponse = {
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid registration data',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error.errors[0]?.message || 'Invalid input data',
            details: validation.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      const result = await authService.register(validation.data);

      req.session.regenerate((err) => {
        if (err) {
          logger.error('Failed to regenerate session on register', { error: err });
          return next(err);
        }

        req.session.userId = result.user.id;
        req.session.userEmail = result.user.email;
        req.session.userName = result.user.name;
        req.session.authenticatedAt = new Date().toISOString();

        req.session.save((saveErr) => {
          if (saveErr) {
            logger.error('Failed to save session on register', { error: saveErr });
            return next(saveErr);
          }

          const response: ApiResponse = {
            success: true,
            message: 'Parent account created successfully. Welcome to AI Playground!',
            data: {
              user: result.user,
            },
            error: null,
          };

          res.status(201).json(response);
        });
      });
    } catch (error) {
      if (error instanceof AuthServiceError) {
        const response: ApiResponse = {
          success: false,
          message: error.message,
          data: null,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticates user using email and password
   */
  async loginWithPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = loginPasswordSchema.safeParse(req.body);
      if (!validation.success) {
        const response: ApiResponse = {
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid email or password',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error.errors[0]?.message || 'Invalid input data',
            details: validation.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      const { email, password } = validation.data;
      const result = await authService.loginWithPassword(email, password);

      req.session.regenerate((err) => {
        if (err) {
          logger.error('Failed to regenerate session on loginWithPassword', { error: err });
          return next(err);
        }

        req.session.userId = result.user.id;
        req.session.userEmail = result.user.email;
        req.session.userName = result.user.name;
        req.session.authenticatedAt = new Date().toISOString();

        req.session.save((saveErr) => {
          if (saveErr) {
            logger.error('Failed to save session on loginWithPassword', { error: saveErr });
            return next(saveErr);
          }

          const response: ApiResponse = {
            success: true,
            message: 'Welcome back!',
            data: {
              user: result.user,
            },
            error: null,
          };

          res.status(200).json(response);
        });
      });
    } catch (error) {
      if (error instanceof AuthServiceError) {
        const response: ApiResponse = {
          success: false,
          message: error.message,
          data: null,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/send-otp
   */
  async sendOtp(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = sendOtpSchema.safeParse(req.body);
      if (!validation.success) {
        const response: ApiResponse = {
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid email address',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error.errors[0]?.message || 'Invalid input data',
            details: validation.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      const { email, intent } = validation.data;
      const result = await authService.sendOtp(email, intent);

      const response: ApiResponse = {
        success: true,
        message: 'If the email address is valid, a verification code has been dispatched.',
        data: {
          challengeId: result.challengeId,
          expiresAt: result.expiresAt.toISOString(),
          cooldownSeconds: result.cooldownSeconds,
        },
        error: null,
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof AuthServiceError) {
        const response: ApiResponse = {
          success: false,
          message: error.message,
          data: null,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-otp
   */
  async verifyOtp(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = verifyOtpSchema.safeParse(req.body);
      if (!validation.success) {
        const response: ApiResponse = {
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid challenge or OTP code',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error.errors[0]?.message || 'Invalid input data',
            details: validation.error.format(),
          },
        };
        res.status(400).json(response);
        return;
      }

      const { challengeId, otp } = validation.data;
      const result = await authService.verifyOtp(challengeId, otp);

      // Session regeneration to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          logger.error('Failed to regenerate session on verifyOtp', { error: err });
          return next(err);
        }

        req.session.userId = result.user.id;
        req.session.userEmail = result.user.email;
        req.session.authenticatedAt = new Date().toISOString();

        req.session.save((saveErr) => {
          if (saveErr) {
            logger.error('Failed to save session on verifyOtp', { error: saveErr });
            return next(saveErr);
          }

          const response: ApiResponse = {
            success: true,
            message: 'Authentication successful. Welcome!',
            data: {
              user: result.user,
            },
            error: null,
          };

          res.status(200).json(response);
        });
      });
    } catch (error) {
      if (error instanceof AuthServiceError) {
        const response: ApiResponse = {
          success: false,
          message: error.message,
          data: null,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/resend-otp
   */
  async resendOtp(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = resendOtpSchema.safeParse(req.body);
      if (!validation.success) {
        const response: ApiResponse = {
          success: false,
          message: validation.error.errors[0]?.message || 'Invalid challenge identifier',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error.errors[0]?.message || 'Invalid input data',
          },
        };
        res.status(400).json(response);
        return;
      }

      const result = await authService.resendOtp(validation.data.challengeId);

      const response: ApiResponse = {
        success: true,
        message: 'A fresh verification code has been dispatched to your email.',
        data: {
          challengeId: result.challengeId,
          expiresAt: result.expiresAt.toISOString(),
          cooldownSeconds: result.cooldownSeconds,
        },
        error: null,
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof AuthServiceError) {
        const response: ApiResponse = {
          success: false,
          message: error.message,
          data: null,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        };
        res.status(error.statusCode).json(response);
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Not authenticated',
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No active session',
        },
      };
      res.status(401).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Current authenticated user profile',
      data: {
        user: req.user,
      },
      error: null,
    };

    res.status(200).json(response);
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const isAlreadyLoggedOut = !req.session?.userId;

    // Destroy session safely
    req.session.destroy((err) => {
      if (err) {
        logger.error('Failed to destroy session on logout', { error: err });
        return next(err);
      }

      // Clear cookie with matching attributes
      const isProd = env.NODE_ENV === 'production';
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
      });

      const response: ApiResponse = {
        success: true,
        message: isAlreadyLoggedOut
          ? 'No active session existed, safe logout completed.'
          : 'Successfully signed out.',
        data: null,
        error: null,
      };

      res.status(200).json(response);
    });
  }
}

export const authController = new AuthController();

