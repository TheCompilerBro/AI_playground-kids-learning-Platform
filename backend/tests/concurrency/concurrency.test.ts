import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { createApp } from '../../src/app.js';
import { setupTestDatabase, teardownTestDatabase, clearDatabaseCollections } from '../setup-test-db.js';
import { emailService } from '../../src/services/email.service.js';
import { TestEmailAdapter } from '../../src/services/email-adapters/test.adapter.js';
import { OTPChallengeModel } from '../../src/models/otp-challenge.model.js';
import { EmailOutboxModel } from '../../src/models/email-outbox.model.js';

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

describe('Phase 3 & 12: Concurrency & Race Condition Tests', () => {
  const email = 'concurrency.test@example.com';

  it('handles 2 concurrent send-otp requests with identical key safely without duplicate emails', async () => {
    const key = crypto.randomUUID();

    // Fire 2 concurrent requests with identical idempotency key
    const [res1, res2] = await Promise.all([
      request(app).post('/api/auth/send-otp').set('Idempotency-Key', key).send({ email }),
      request(app).post('/api/auth/send-otp').set('Idempotency-Key', key).send({ email }),
    ]);

    const statuses = [res1.status, res2.status].sort();

    // Either [200, 200] (if one completed and cached response was returned)
    // or [200, 409] (if one was in-flight when the other hit the server)
    const validOutcomes =
      (statuses[0] === 200 && statuses[1] === 200) ||
      (statuses[0] === 200 && statuses[1] === 409);

    expect(validOutcomes).toBe(true);

    // Verify exactly ONE email outbox event was created in MongoDB
    const outboxCount = await EmailOutboxModel.countDocuments({ recipient: email });
    expect(outboxCount).toBe(1);

    // Verify exactly ONE challenge was created
    const challengeCount = await OTPChallengeModel.countDocuments({ emailNormalized: email });
    expect(challengeCount).toBe(1);
  });

  it('prevents concurrent OTP consumption: exactly one concurrent verify request consumes the challenge', async () => {
    const sendKey = crypto.randomUUID();
    const sendRes = await request(app)
      .post('/api/auth/send-otp')
      .set('Idempotency-Key', sendKey)
      .send({ email });

    const challengeId = sendRes.body.data.challengeId;
    const challenge = await OTPChallengeModel.findOne({ challengeId });
    expect(challenge).not.toBeNull();

    // Find the OTP by checking the latest challenge outbox
    const outbox = await EmailOutboxModel.findOne({ recipient: email });
    expect(outbox).not.toBeNull();

    // Use test email adapter to get OTP
    const sentEmail = testEmailAdapter.sentEmails[0];
    const otp = sentEmail.text.match(/\b\d{6}\b/)![0];

    // Fire 2 concurrent verify requests with DIFFERENT idempotency keys (simulating 2 different tabs or devices)
    const keyA = crypto.randomUUID();
    const keyB = crypto.randomUUID();

    const [verifyA, verifyB] = await Promise.all([
      request(app).post('/api/auth/verify-otp').set('Idempotency-Key', keyA).send({ challengeId, otp }),
      request(app).post('/api/auth/verify-otp').set('Idempotency-Key', keyB).send({ challengeId, otp }),
    ]);

    const statuses = [verifyA.status, verifyB.status].sort();

    // Exactly one should succeed (200), and the other should fail with 400 (OTP_ALREADY_USED)
    expect(statuses).toEqual([200, 400]);

    const failedRes = verifyA.status === 400 ? verifyA : verifyB;
    expect(failedRes.body.error.code).toBe('OTP_ALREADY_USED');

    // Verify database shows challenge was consumed exactly once
    const updatedChallenge = await OTPChallengeModel.findOne({ challengeId });
    expect(updatedChallenge?.consumedAt).not.toBeNull();
  });
});

