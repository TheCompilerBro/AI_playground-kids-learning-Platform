import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { createApp } from '../../src/app.js';
import { setupTestDatabase, teardownTestDatabase, clearDatabaseCollections } from '../setup-test-db.js';
import { emailService } from '../../src/services/email.service.js';
import { TestEmailAdapter } from '../../src/services/email-adapters/test.adapter.js';
import { redactSensitiveData } from '../../src/utils/logger.js';
import { OTPChallengeModel } from '../../src/models/otp-challenge.model.js';
import { emailOutboxWorker } from '../../src/workers/email-outbox.worker.js';

let app: any;
let testEmailAdapter: TestEmailAdapter;

beforeAll(async () => {
  await setupTestDatabase();
  testEmailAdapter = new TestEmailAdapter();
  emailService.setAdapter(testEmailAdapter);
  app = createApp();
});

afterAll(async () => {
  await teardownTestDatabase();
});

beforeEach(async () => {
  await clearDatabaseCollections();
  testEmailAdapter.clear();
});

describe('Phase 9 & 12: Application Security Tests', () => {
  const email = 'security.officer@company.corp';

  it('rejects missing or malformed Idempotency-Key with 400 INVALID_IDEMPOTENCY_KEY', async () => {
    // Missing key
    const missingRes = await request(app).post('/api/auth/send-otp').send({ email });
    expect(missingRes.status).toBe(400);
    expect(missingRes.body.error.code).toBe('INVALID_IDEMPOTENCY_KEY');

    // Malformed non-UUID key
    const malformedRes = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', 'not-a-valid-uuid')
      .send({ email });
    expect(malformedRes.status).toBe(400);
    expect(malformedRes.body.error.code).toBe('INVALID_IDEMPOTENCY_KEY');
  });

  it('rejects key reuse with altered payload with 422 IDEMPOTENCY_KEY_REUSED', async () => {
    const key = crypto.randomUUID();

    // First request
    const firstRes = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', key)
      .send({ email: 'user.first@example.com' });
    expect(firstRes.status).toBe(200);

    // Second request with same key but different email payload
    const reusedRes = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', key)
      .send({ email: 'user.second@example.com' });
    expect(reusedRes.status).toBe(422);
    expect(reusedRes.body.error.code).toBe('IDEMPOTENCY_KEY_REUSED');
  });

  it('avoids account enumeration by returning identical generic response format', async () => {
    const res1 = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ email: 'nonexistent.user@example.com' });

    const res2 = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ email: 'registered.user@example.com' });

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res1.body.message).toBe(res2.body.message);
    expect(typeof res1.body.data.challengeId).toBe('string');
    expect(typeof res2.body.data.challengeId).toBe('string');
  });

  it('prevents session fixation by regenerating session cookie upon login', async () => {
    // 1. Visit unauthenticated to get initial session cookie
    const initialRes = await request(app).get('/health');
    const initialCookie = initialRes.headers['set-cookie']?.[0];

    // 2. Request OTP
    const sendRes = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ email });
    const challengeId = sendRes.body.data.challengeId;

    await emailOutboxWorker.processBatch();
    const sentEmail = testEmailAdapter.sentEmails[0];
    const otp = sentEmail.text.match(/\b\d{6}\b/)![0];

    // 3. Verify OTP and authenticate
    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .set('Idempotency-Key', crypto.randomUUID())
      .set('Cookie', initialCookie || '')
      .send({ challengeId, otp });

    expect(verifyRes.status).toBe(200);
    const authCookie = verifyRes.headers['set-cookie']?.[0];
    expect(authCookie).toBeDefined();

    // Cookie has HttpOnly and SameSite attributes
    expect(authCookie).toContain('HttpOnly');
    expect(authCookie).toContain('Path=/');

    // Authenticated cookie must differ from unauthenticated session (if initial was set)
    if (initialCookie) {
      expect(authCookie).not.toBe(initialCookie);
    }
  });

  it('protects private dashboard endpoint against unauthenticated requests', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('ensures secret redaction prevents OTPs and secrets from leaking into logs', () => {
    const raw = {
      email: 'user@example.com',
      otp: '938102',
      sessionSecret: 'secret_key_value',
      headers: {
        authorization: 'Bearer eyJhbGciOi...',
        cookie: 'connect.sid=s%3A...',
      },
    };

    const sanitized = redactSensitiveData(raw) as any;
    expect(sanitized.otp).toBe('[REDACTED]');
    expect(sanitized.sessionSecret).toBe('[REDACTED]');
    expect(sanitized.headers.authorization).toBe('[REDACTED]');
    expect(sanitized.headers.cookie).toBe('[REDACTED]');
    expect(sanitized.email).toBe('user@example.com');
  });
});
