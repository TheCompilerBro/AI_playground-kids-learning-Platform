import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupTestDatabase, teardownTestDatabase, clearDatabaseCollections } from '../setup-test-db.js';
import { IdempotencyService } from '../../src/services/idempotency.service.js';
import { IdempotencyRecordModel } from '../../src/models/idempotency-record.model.js';
import { computeRequestFingerprint, computeScopeHash } from '../../src/utils/request-fingerprint.js';

let idempotencyService: IdempotencyService;

beforeAll(async () => {
  await setupTestDatabase();
  idempotencyService = new IdempotencyService();
});

afterAll(async () => {
  await teardownTestDatabase();
});

beforeEach(async () => {
  await clearDatabaseCollections();
});

describe('Phase 3: Idempotency System', () => {
  const scopeHash = computeScopeHash('user-123', '/api/auth/send-otp');
  const validKey = 'a0000000-0000-4000-8000-000000000001';
  const operation = 'SEND_OTP';
  const fingerprint = computeRequestFingerprint({
    method: 'POST',
    path: '/api/auth/send-otp',
    operation,
    body: { email: 'test@example.com' },
  });

  it('Case A: First request with a new key acquires the lease', async () => {
    const result = await idempotencyService.acquire({
      scopeHash,
      key: validKey,
      operation,
      requestFingerprint: fingerprint,
    });

    expect(result.status).toBe('ACQUIRED');
    if (result.status === 'ACQUIRED') {
      expect(result.record.key).toBe(validKey);
      expect(result.record.status).toBe('PROCESSING');
    }

    const saved = await IdempotencyRecordModel.findOne({ scopeHash, key: validKey });
    expect(saved).not.toBeNull();
    expect(saved?.status).toBe('PROCESSING');
  });

  it('Case B: Completed request replays the cached safe response without re-executing', async () => {
    // 1. Acquire
    await idempotencyService.acquire({
      scopeHash,
      key: validKey,
      operation,
      requestFingerprint: fingerprint,
    });

    // 2. Complete
    const safeBody = { success: true, message: 'OTP sent' };
    await idempotencyService.complete(scopeHash, validKey, 200, safeBody);

    // 3. Second request with same key and same payload
    const secondResult = await idempotencyService.acquire({
      scopeHash,
      key: validKey,
      operation,
      requestFingerprint: fingerprint,
    });

    expect(secondResult.status).toBe('COMPLETED');
    if (secondResult.status === 'COMPLETED') {
      expect(secondResult.responseStatus).toBe(200);
      expect(secondResult.responseBody).toEqual(safeBody);
    }
  });

  it('Case C: In-flight / concurrent request returns PROCESSING with Retry-After', async () => {
    // Acquire first
    await idempotencyService.acquire({
      scopeHash,
      key: validKey,
      operation,
      requestFingerprint: fingerprint,
    });

    // Concurrent second request before completion
    const concurrentResult = await idempotencyService.acquire({
      scopeHash,
      key: validKey,
      operation,
      requestFingerprint: fingerprint,
    });

    expect(concurrentResult.status).toBe('PROCESSING');
    if (concurrentResult.status === 'PROCESSING') {
      expect(concurrentResult.retryAfter).toBe(2);
    }
  });

  it('Case D: Same key with different payload is rejected with MISMATCH (422)', async () => {
    // Acquire with first payload
    await idempotencyService.acquire({
      scopeHash,
      key: validKey,
      operation,
      requestFingerprint: fingerprint,
    });

    // Attempt with different payload using same key
    const differentFingerprint = computeRequestFingerprint({
      method: 'POST',
      path: '/api/auth/send-otp',
      operation,
      body: { email: 'different@example.com' },
    });

    const result = await idempotencyService.acquire({
      scopeHash,
      key: validKey,
      operation,
      requestFingerprint: differentFingerprint,
    });

    expect(result.status).toBe('MISMATCH');
  });

  it('Scope isolation: Different scopes can use the same key string without collision', async () => {
    const scope1 = computeScopeHash('client-A', '/api/auth/send-otp');
    const scope2 = computeScopeHash('client-B', '/api/auth/send-otp');

    const res1 = await idempotencyService.acquire({
      scopeHash: scope1,
      key: validKey,
      operation,
      requestFingerprint: fingerprint,
    });
    expect(res1.status).toBe('ACQUIRED');

    const res2 = await idempotencyService.acquire({
      scopeHash: scope2,
      key: validKey,
      operation,
      requestFingerprint: fingerprint,
    });
    expect(res2.status).toBe('ACQUIRED');
  });
});

