import crypto from 'crypto';
import { env } from '../config/env.js';

/**
 * Canonically sorts object keys recursively to ensure deterministic serialization
 */
export function canonicalizeJson(obj: unknown): string {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return JSON.stringify(obj);

  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJson).join(',') + ']';
  }

  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const entries = keys.map((key) => {
    const val = (obj as Record<string, unknown>)[key];
    return `${JSON.stringify(key)}:${canonicalizeJson(val)}`;
  });

  return '{' + entries.join(',') + '}';
}

/**
 * Computes a secure HMAC-SHA-256 request fingerprint across:
 * - HTTP method
 * - Canonical path
 * - Canonical payload
 * - Operation name
 *
 * Using a keyed HMAC prevents offline rainbow/dictionary attacks against 6-digit OTP codes.
 */
export function computeRequestFingerprint(params: {
  method: string;
  path: string;
  operation: string;
  body: unknown;
  secret?: string;
}): string {
  const secret = params.secret || env.IDEMPOTENCY_HMAC_SECRET;
  const canonicalBody = canonicalizeJson(params.body);
  const data = `${params.method.toUpperCase()}|${params.path}|${params.operation}|${canonicalBody}`;

  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Computes a scoped hash for the client context to prevent key collision across users/sessions
 */
export function computeScopeHash(clientIdentifier: string, route: string, secret?: string): string {
  const hmacSecret = secret || env.IDEMPOTENCY_HMAC_SECRET;
  return crypto
    .createHmac('sha256', hmacSecret)
    .update(`${clientIdentifier}:${route}`)
    .digest('hex');
}

