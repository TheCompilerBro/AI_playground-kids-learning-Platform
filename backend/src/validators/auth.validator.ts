import { z } from 'zod';

export const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Normalizes email addresses consistently:
 * - Trims whitespace
 * - Converts to lower case
 * - Strips plus-tags or normalizes domain if needed
 */
export function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex === -1) return trimmed;

  let local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  // If googlemail/gmail, remove dots and strip +labels
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.replace(/\./g, '');
    const plusIndex = local.indexOf('+');
    if (plusIndex !== -1) {
      local = local.slice(0, plusIndex);
    }
  }

  return `${local}@${domain}`;
}

export const idempotencyKeyHeaderSchema = z
  .string({
    required_error: 'Idempotency-Key header is required',
  })
  .min(1, 'Idempotency-Key header cannot be empty')
  .max(128, 'Idempotency-Key header must not exceed 128 characters')
  .regex(UUID_V4_REGEX, 'Idempotency-Key must be a valid UUID v4 format');

export const sendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email must not exceed 254 characters')
    .transform(normalizeEmail),
  intent: z.enum(['login', 'signup']).optional(),
});

export const verifyOtpSchema = z.object({
  challengeId: z
    .string()
    .min(1, 'Challenge ID is required')
    .regex(UUID_V4_REGEX, 'Challenge ID must be a valid UUID'),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'OTP must be a 6-digit number'),
});

export const resendOtpSchema = z.object({
  challengeId: z
    .string()
    .min(1, 'Challenge ID is required')
    .regex(UUID_V4_REGEX, 'Challenge ID must be a valid UUID'),
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Parent's full name is required" })
    .trim()
    .min(2, "Parent's full name must be at least 2 characters")
    .max(100, "Parent's full name must not exceed 100 characters"),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must not exceed 20 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email must not exceed 254 characters')
    .transform(normalizeEmail),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must not exceed 128 characters'),
});

export const loginPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email must not exceed 254 characters')
    .transform(normalizeEmail),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .max(128, 'Password must not exceed 128 characters'),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginPasswordInput = z.infer<typeof loginPasswordSchema>;


