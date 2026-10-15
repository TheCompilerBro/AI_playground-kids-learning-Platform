import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { createApp } from '../../src/app.js';
import { setupTestDatabase, teardownTestDatabase, clearDatabaseCollections } from '../setup-test-db.js';
import { emailService } from '../../src/services/email.service.js';
import { TestEmailAdapter } from '../../src/services/email-adapters/test.adapter.js';
import { OTPChallengeModel } from '../../src/models/otp-challenge.model.js';
import { UserModel } from '../../src/models/user.model.js';
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

describe('Phase 8: End-to-End Integration Tests', () => {
  const email = 'alex.developer@example.com';

  it('completes the full authentication lifecycle: send-otp -> verify-otp -> me -> logout', async () => {
    const sendKey = crypto.randomUUID();
    const verifyKey = crypto.randomUUID();
    const logoutKey = crypto.randomUUID();

    // 1. Send OTP
    const sendRes = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', sendKey)
      .send({ email });

    expect(sendRes.status).toBe(200);
    expect(sendRes.body.success).toBe(true);
    expect(sendRes.body.data.challengeId).toBeDefined();

    const challengeId = sendRes.body.data.challengeId;

    // Process outbox delivery
    await emailOutboxWorker.processBatch();
    expect(testEmailAdapter.sentEmails.length).toBe(1);
    const sentEmail = testEmailAdapter.sentEmails[0];
    expect(sentEmail.to).toBe(email);

    // Extract OTP code from the generated challenge in DB for testing
    const challenge = await OTPChallengeModel.findOne({ challengeId });
    expect(challenge).not.toBeNull();

    // The test email text contains the OTP
    const match = sentEmail.text.match(/\b\d{6}\b/);
    expect(match).not.toBeNull();
    const otp = match![0];

    // 2. Verify OTP
    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .set('Idempotency-Key', verifyKey)
      .send({ challengeId, otp });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.data.user.email).toBe(email);

    // Extract session cookie
    const cookies = verifyRes.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const sessionCookie = cookies[0];

    // 3. Access Protected Route: GET /api/auth/me
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', sessionCookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.user.email).toBe(email);

    // 4. Logout: POST /api/auth/logout
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Idempotency-Key', logoutKey)
      .set('Cookie', sessionCookie);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    // 5. Subsequent access to /me with the logged out session is rejected
    const unauthRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', sessionCookie);

    expect(unauthRes.status).toBe(401);
    expect(unauthRes.body.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects incorrect OTP and counts attempts', async () => {
    const sendKey = crypto.randomUUID();
    const sendRes = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', sendKey)
      .send({ email });

    const challengeId = sendRes.body.data.challengeId;

    // Send wrong OTP
    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ challengeId, otp: '000000' });

    expect(verifyRes.status).toBe(400);
    expect(verifyRes.body.error.code).toBe('INVALID_OTP');
    expect(verifyRes.body.error.details.attemptsRemaining).toBe(4);

    const challenge = await OTPChallengeModel.findOne({ challengeId });
    expect(challenge?.attempts).toBe(1);
  });

  it('locks challenge after 5 failed attempts', async () => {
    const sendRes = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ email });

    const challengeId = sendRes.body.data.challengeId;

    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post('/api/auth/verify-otp')
        .set('Idempotency-Key', crypto.randomUUID())
        .send({ challengeId, otp: '111111' });

      if (i < 4) {
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('INVALID_OTP');
      } else {
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('MAX_ATTEMPTS_EXCEEDED');
      }
    }
  });

  it('resend-otp invalidates older challenge and issues new code', async () => {
    const sendRes = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ email });

    const originalChallengeId = sendRes.body.data.challengeId;

    // Simulate 61 seconds passed by adjusting challenge createdAt directly in MongoDB
    await OTPChallengeModel.collection.updateOne(
      { challengeId: originalChallengeId },
      { $set: { createdAt: new Date(Date.now() - 65 * 1000) } }
    );

    const resendRes = await request(app)
      .post('/api/auth/resend-otp')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ challengeId: originalChallengeId });

    expect(resendRes.status).toBe(200);
    expect(resendRes.body.data.challengeId).not.toBe(originalChallengeId);

    // Old challenge is marked superseded
    const oldChallenge = await OTPChallengeModel.findOne({ challengeId: originalChallengeId });
    expect(oldChallenge?.supersededAt).not.toBeNull();

    // Trying to verify the old challenge is rejected with CHALLENGE_SUPERSEDED
    const verifyOld = await request(app)
      .post('/api/auth/verify-otp')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ challengeId: originalChallengeId, otp: '123456' });

    expect(verifyOld.status).toBe(400);
    expect(verifyOld.body.error.code).toBe('CHALLENGE_SUPERSEDED');
  });
});
