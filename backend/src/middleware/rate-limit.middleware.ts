import rateLimit, { Options } from 'express-rate-limit';
import { Request, Response } from 'express';
import { ApiResponse } from '../types/index.js';

function createCustomHandler(message: string, code = 'RATE_LIMIT_EXCEEDED') {
  return (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: false,
      message,
      data: null,
      error: {
        code,
        message,
      },
    };
    res.status(429).json(response);
  };
}

// Global API rate limit: 100 requests / 15 minutes
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createCustomHandler('Too many requests from this IP. Please try again later.'),
});

// Send OTP limit: 5 requests / 10 minutes
export const sendOtpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email ? String(req.body.email).toLowerCase() : '';
    return `${req.ip || 'ip'}_${email}`;
  },
  handler: createCustomHandler('Too many OTP requests for this address. Please wait before requesting another.'),
});

// Verify OTP limit: 10 attempts / 10 minutes
export const verifyOtpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createCustomHandler('Too many verification attempts. Please wait before trying again.'),
});

// Resend OTP limit: 3 requests / 5 minutes
export const resendOtpRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createCustomHandler('Too many resend requests. Please wait before requesting another.'),
});

// Login attempt limit: 15 attempts / 10 minutes
export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createCustomHandler('Too many login attempts. Please wait before trying again.'),
});

// Registration attempt limit: 10 attempts / 15 minutes
export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createCustomHandler('Too many registration attempts. Please wait before trying again.'),
});

