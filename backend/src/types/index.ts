import { Request } from 'express';
import 'express-session';

export interface UserDocument {
  _id: string;
  name?: string;
  phone?: string;
  email: string;
  emailNormalized: string;
  password?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OTPChallengeDocument {
  _id: string;
  challengeId: string;
  emailNormalized: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  consumedAt?: Date | null;
  supersededAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type IdempotencyStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface IdempotencyRecordDocument {
  _id: string;
  scopeHash: string;
  key: string;
  operation: string;
  requestFingerprint: string;
  status: IdempotencyStatus;
  responseStatus?: number;
  safeResponseBody?: Record<string, unknown> | null;
  ownerToken?: string;
  leaseExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export type EmailDeliveryStatus = 'PENDING' | 'SENDING' | 'SENT' | 'FAILED' | 'DEAD_LETTER';

export interface EmailOutboxDocument {
  _id: string;
  eventId: string;
  eventType: string;
  recipient: string;
  encryptedPayload: string; // JSON string containing ciphertext, iv, tag
  status: EmailDeliveryStatus;
  attempts: number;
  nextAttemptAt: Date;
  providerMessageId?: string | null;
  lastErrorCode?: string | null;
  lastErrorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
}

// Session data extension
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userEmail?: string;
    userName?: string;
    authenticatedAt?: string;
  }
}

// Request extension to store idempotency record & authenticated user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name?: string;
    phone?: string;
    email: string;
    emailNormalized: string;
  };
  idempotencyRecord?: any;
  anonymousScopeToken?: string;
}
