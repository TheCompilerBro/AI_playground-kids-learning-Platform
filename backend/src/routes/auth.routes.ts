import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { idempotencyMiddleware } from '../middleware/idempotency.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  sendOtpRateLimiter,
  verifyOtpRateLimiter,
  resendOtpRateLimiter,
  loginRateLimiter,
  registerRateLimiter,
} from '../middleware/rate-limit.middleware.js';

const router = Router();

// Register with Parent's Full Name, Phone, Email & Password
router.post(
  '/register',
  registerRateLimiter,
  idempotencyMiddleware('REGISTER'),
  authController.register
);

// Sign in with Email & Password
router.post(
  '/login',
  loginRateLimiter,
  idempotencyMiddleware('LOGIN'),
  authController.loginWithPassword
);

// Step 1: Request OTP
router.post(
  '/send-otp',
  sendOtpRateLimiter,
  idempotencyMiddleware('SEND_OTP'),
  authController.sendOtp
);

// Step 2: Verify OTP
router.post(
  '/verify-otp',
  verifyOtpRateLimiter,
  idempotencyMiddleware('VERIFY_OTP'),
  authController.verifyOtp
);

// Step 5: Resend OTP
router.post(
  '/resend-otp',
  resendOtpRateLimiter,
  idempotencyMiddleware('RESEND_OTP'),
  authController.resendOtp
);

// Step 3: Current Authenticated User Profile
router.get('/me', requireAuth, authController.getMe);

// Step 4: Logout
router.post(
  '/logout',
  idempotencyMiddleware('LOGOUT'),
  authController.logout
);

export const authRoutes = router;

