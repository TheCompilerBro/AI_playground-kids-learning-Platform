import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters long'),
  OTP_HMAC_SECRET: z.string().min(32, 'OTP_HMAC_SECRET must be at least 32 characters long'),
  IDEMPOTENCY_HMAC_SECRET: z.string().min(32, 'IDEMPOTENCY_HMAC_SECRET must be at least 32 characters long'),
  EMAIL_ENCRYPTION_KEY: z.string().refine(
    (key) => {
      // Must be 32 bytes (either 32 ascii characters or 64 hex characters)
      return key.length === 32 || (key.length === 64 && /^[0-9a-fA-F]+$/.test(key));
    },
    { message: 'EMAIL_ENCRYPTION_KEY must be a 32-byte string (32 characters or 64 hex characters)' }
  ),
  EMAIL_PROVIDER: z.enum(['resend', 'smtp', 'test']).default('resend'),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_SECURE: z.coerce.boolean().optional().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().min(1).default('AI Playground Auth <onboarding@resend.dev>'),
  SESSION_MAX_AGE_MINUTES: z.coerce.number().default(60),
  OTP_TTL_SECONDS: z.coerce.number().default(300),
  OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().default(60),
  OTP_MAX_ATTEMPTS: z.coerce.number().default(5),
  IDEMPOTENCY_RETENTION_HOURS: z.coerce.number().default(24),
  IDEMPOTENCY_LEASE_SECONDS: z.coerce.number().default(30),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(overrideEnv?: Record<string, unknown>): Env {
  const source = overrideEnv || process.env;
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const errorDetails = result.error.errors
      .map((e) => `  - ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`Environment configuration error:\n${errorDetails}`);
  }

  return result.data;
}

// In test environment, provide fallback valid defaults if not explicitly set
const defaultTestEnv = {
  NODE_ENV: 'test',
  PORT: 3000,
  FRONTEND_URL: 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test_db',
  SESSION_SECRET: process.env.SESSION_SECRET || 'a_very_long_test_session_secret_at_least_32_chars!',
  OTP_HMAC_SECRET: process.env.OTP_HMAC_SECRET || 'a_very_long_test_otp_hmac_secret_at_least_32_chars!',
  IDEMPOTENCY_HMAC_SECRET: process.env.IDEMPOTENCY_HMAC_SECRET || 'a_very_long_test_idempotency_secret_32_chars!',
  EMAIL_ENCRYPTION_KEY: process.env.EMAIL_ENCRYPTION_KEY || '01234567890123456789012345678901',
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'test',
  EMAIL_FROM: 'Test Auth <auth@example.com>',
};

export const env: Env =
  process.env.NODE_ENV === 'test'
    ? validateEnv({ ...defaultTestEnv, ...process.env })
    : validateEnv();

