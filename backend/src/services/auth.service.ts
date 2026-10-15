import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { UserModel, IUser } from '../models/user.model.js';
import { OTPChallengeModel, IOTPChallenge } from '../models/otp-challenge.model.js';
import { EmailOutboxModel } from '../models/email-outbox.model.js';
import { emailOutboxWorker } from '../workers/email-outbox.worker.js';
import { generateOtp, hashOtp, verifyOtpHash, encryptPayload } from '../utils/crypto.js';
import { normalizeEmail } from '../validators/auth.validator.js';
import { withTransaction } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface SendOtpResult {
  challengeId: string;
  expiresAt: Date;
  cooldownSeconds: number;
}

export interface UserResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  emailNormalized: string;
  emailVerified: boolean;
  hasPassword?: boolean;
}

export interface VerifyOtpResult {
  user: UserResponse;
}

export class AuthServiceError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(statusCode: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AuthServiceError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class AuthService {
  /**
   * Generates and dispatches a 6-digit OTP challenge via transactional email outbox
   */
  async sendOtp(rawEmail: string, intent?: 'login' | 'signup'): Promise<SendOtpResult> {
    const emailNormalized = normalizeEmail(rawEmail);
    const now = new Date();

    if (intent === 'login') {
      const existingUser = await UserModel.findOne({ emailNormalized });
      if (!existingUser) {
        throw new AuthServiceError(
          404,
          'USER_NOT_FOUND',
          'No account found with this email. Please create an account first.'
        );
      }
    } else if (intent === 'signup') {
      const existingUser = await UserModel.findOne({ emailNormalized });
      if (existingUser) {
        throw new AuthServiceError(
          409,
          'USER_ALREADY_EXISTS',
          'An account already exists with this email. Please sign in instead.'
        );
      }
    }

    // Check if an unexpired challenge was created within cooldown window
    const recentChallenge = await OTPChallengeModel.findOne({
      emailNormalized,
      consumedAt: null,
      supersededAt: null,
      createdAt: { $gt: new Date(now.getTime() - env.OTP_RESEND_COOLDOWN_SECONDS * 1000) },
    });

    if (recentChallenge) {
      const remainingCooldown = Math.max(
        1,
        env.OTP_RESEND_COOLDOWN_SECONDS - Math.floor((now.getTime() - recentChallenge.createdAt.getTime()) / 1000)
      );
      throw new AuthServiceError(
        429,
        'COOLDOWN_ACTIVE',
        `A verification code was recently sent. Please wait ${remainingCooldown}s before requesting another.`,
        { retryAfter: remainingCooldown }
      );
    }

    const challengeId = crypto.randomUUID();
    const eventId = crypto.randomUUID();
    const otp = generateOtp();
    if (env.NODE_ENV === 'development') {
      logger.info(`[DEV MODE OTP] Verification code for ${rawEmail}: ${otp}`);
    }
    const otpHash = hashOtp(otp, env.OTP_HMAC_SECRET);
    const expiresAt = new Date(now.getTime() + env.OTP_TTL_SECONDS * 1000);
    const outboxExpiresAt = new Date(now.getTime() + 86400 * 1000); // 24h retention

    // Encrypt OTP delivery payload with AES-256-GCM
    const encryptedPayloadObj = encryptPayload(
      JSON.stringify({ otp, email: rawEmail.trim() }),
      env.EMAIL_ENCRYPTION_KEY
    );
    const encryptedPayload = JSON.stringify(encryptedPayloadObj);

    // Atomically invalidate older active challenges and insert new challenge + email outbox
    await withTransaction(async (session) => {
      await OTPChallengeModel.updateMany(
        { emailNormalized, consumedAt: null, supersededAt: null },
        { $set: { supersededAt: now } },
        { session: session || undefined }
      );

      await OTPChallengeModel.create(
        [
          {
            challengeId,
            emailNormalized,
            otpHash,
            expiresAt,
            attempts: 0,
            consumedAt: null,
            supersededAt: null,
          },
        ],
        { session: session || undefined }
      );

      await EmailOutboxModel.create(
        [
          {
            eventId,
            eventType: 'SEND_OTP',
            recipient: emailNormalized,
            encryptedPayload,
            status: 'PENDING',
            attempts: 0,
            nextAttemptAt: now,
            expiresAt: outboxExpiresAt,
          },
        ],
        { session: session || undefined }
      );
    });

    logger.info('OTP challenge created and outbox event queued', {
      challengeId,
      recipientDomain: emailNormalized.split('@')[1],
    });

    // Trigger asynchronous worker processing immediately for low latency
    emailOutboxWorker.processBatch().catch((err) => {
      logger.error('Background worker dispatch error on sendOtp', { error: err });
    });

    return {
      challengeId,
      expiresAt,
      cooldownSeconds: env.OTP_RESEND_COOLDOWN_SECONDS,
    };
  }

  /**
   * Verifies an OTP challenge, enforces attempt limits, and atomically provisions/retrieves user
   */
  async verifyOtp(challengeId: string, otp: string): Promise<VerifyOtpResult> {
    const challenge = await OTPChallengeModel.findOne({ challengeId });

    if (!challenge) {
      throw new AuthServiceError(400, 'INVALID_CHALLENGE', 'The verification session was not found. Please request a new code.');
    }

    if (challenge.consumedAt) {
      throw new AuthServiceError(400, 'OTP_ALREADY_USED', 'This verification code has already been used.');
    }

    if (challenge.supersededAt) {
      throw new AuthServiceError(400, 'CHALLENGE_SUPERSEDED', 'A newer verification code was requested. Please check your inbox for the latest code.');
    }

    const now = new Date();
    if (challenge.expiresAt < now) {
      throw new AuthServiceError(400, 'OTP_EXPIRED', 'This verification code has expired. Please request a new code.');
    }

    if (challenge.attempts >= env.OTP_MAX_ATTEMPTS) {
      throw new AuthServiceError(
        400,
        'MAX_ATTEMPTS_EXCEEDED',
        'Maximum verification attempts reached for this code. Please request a new code.'
      );
    }

    // Verify constant-time HMAC
    const isValid = verifyOtpHash(otp, challenge.otpHash, env.OTP_HMAC_SECRET);

    if (!isValid) {
      const updated = await OTPChallengeModel.findOneAndUpdate(
        { _id: challenge._id },
        { $inc: { attempts: 1 } },
        { new: true }
      );

      const attemptsRemaining = Math.max(0, env.OTP_MAX_ATTEMPTS - (updated?.attempts || 0));

      if (attemptsRemaining === 0) {
        throw new AuthServiceError(
          400,
          'MAX_ATTEMPTS_EXCEEDED',
          'Maximum verification attempts reached for this code. Please request a new code.'
        );
      }

      throw new AuthServiceError(
        400,
        'INVALID_OTP',
        `Incorrect verification code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`,
        { attemptsRemaining }
      );
    }

    // Atomically consume challenge (optimistic lock against concurrency)
    const consumed = await OTPChallengeModel.findOneAndUpdate(
      { _id: challenge._id, consumedAt: null },
      { $set: { consumedAt: now } },
      { new: true }
    );

    if (!consumed) {
      throw new AuthServiceError(400, 'OTP_ALREADY_USED', 'This verification code has already been used.');
    }

    // Retrieve or create verified user account
    const user = await UserModel.findOneAndUpdate(
      { emailNormalized: challenge.emailNormalized },
      {
        $setOnInsert: {
          email: challenge.emailNormalized,
          emailNormalized: challenge.emailNormalized,
        },
        $set: {
          emailVerified: true,
        },
      },
      { upsert: true, new: true }
    );

    logger.info('OTP successfully verified and session ready for user', {
      userId: user._id.toString(),
      recipientDomain: user.emailNormalized.split('@')[1],
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name || '',
        phone: user.phone || '',
        email: user.email,
        emailNormalized: user.emailNormalized,
        emailVerified: user.emailVerified,
        hasPassword: Boolean(user.password),
      },
    };
  }

  /**
   * Registers a new parent account with full name, phone number, email, and password
   */
  async register(data: {
    name: string;
    phone: string;
    email: string;
    password: string;
  }): Promise<{ user: UserResponse }> {
    const emailNormalized = normalizeEmail(data.email);
    const existingUser = await UserModel.findOne({ emailNormalized });

    if (existingUser) {
      throw new AuthServiceError(
        409,
        'USER_ALREADY_EXISTS',
        'An account already exists with this email. Please sign in instead.'
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserModel.create({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email,
      emailNormalized,
      password: hashedPassword,
      emailVerified: true,
    });

    logger.info('New parent account registered', {
      userId: user._id.toString(),
      recipientDomain: emailNormalized.split('@')[1],
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name || '',
        phone: user.phone || '',
        email: user.email,
        emailNormalized: user.emailNormalized,
        emailVerified: user.emailVerified,
        hasPassword: true,
      },
    };
  }

  /**
   * Authenticates user using email and password
   */
  async loginWithPassword(rawEmail: string, password: string): Promise<{ user: UserResponse }> {
    const emailNormalized = normalizeEmail(rawEmail);
    const user = await UserModel.findOne({ emailNormalized });

    if (!user) {
      throw new AuthServiceError(
        404,
        'USER_NOT_FOUND',
        'No account found with this email. Please create an account first.'
      );
    }

    if (!user.password) {
      throw new AuthServiceError(
        400,
        'NO_PASSWORD_SET',
        'This account was created without a password. Please sign in using Email OTP.'
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthServiceError(
        401,
        'INVALID_CREDENTIALS',
        'Incorrect password. Please try again or use Email OTP.'
      );
    }

    logger.info('User authenticated successfully with password', {
      userId: user._id.toString(),
      recipientDomain: user.emailNormalized.split('@')[1],
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name || '',
        phone: user.phone || '',
        email: user.email,
        emailNormalized: user.emailNormalized,
        emailVerified: user.emailVerified,
        hasPassword: true,
      },
    };
  }

  /**
   * Resends an OTP for an active challenge after checking cooldown
   */
  async resendOtp(challengeId: string): Promise<SendOtpResult> {
    const challenge = await OTPChallengeModel.findOne({ challengeId });

    if (!challenge) {
      throw new AuthServiceError(400, 'INVALID_CHALLENGE', 'The verification session was not found.');
    }

    if (challenge.consumedAt) {
      throw new AuthServiceError(400, 'CHALLENGE_CONSUMED', 'This challenge has already been completed.');
    }

    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - challenge.createdAt.getTime()) / 1000);

    if (elapsedSeconds < env.OTP_RESEND_COOLDOWN_SECONDS) {
      const remainingCooldown = env.OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds;
      throw new AuthServiceError(
        429,
        'COOLDOWN_ACTIVE',
        `Please wait ${remainingCooldown}s before requesting a new code.`,
        { retryAfter: remainingCooldown }
      );
    }

    // Supersede old challenge and create fresh OTP challenge
    await OTPChallengeModel.updateOne({ _id: challenge._id }, { $set: { supersededAt: now } });

    return this.sendOtp(challenge.emailNormalized);
  }
}

export const authService = new AuthService();

