import { describe, it, expect } from 'vitest';
import { generateOtp, hashOtp, verifyOtpHash, encryptPayload, decryptPayload } from '../../src/utils/crypto.js';
import { normalizeEmail, sendOtpSchema, idempotencyKeyHeaderSchema } from '../../src/validators/auth.validator.js';
import { redactSensitiveData } from '../../src/utils/logger.js';
import { validateEnv } from '../../src/config/env.js';

describe('Phase 1: Foundation & Security Utilities', () => {
  describe('Crypto & OTP Generation', () => {
    it('generates a 6-digit numeric OTP', () => {
      for (let i = 0; i < 50; i++) {
        const otp = generateOtp();
        expect(otp).toHaveLength(6);
        expect(/^\d{6}$/.test(otp)).toBe(true);
        const num = parseInt(otp, 10);
        expect(num).toBeGreaterThanOrEqual(100000);
        expect(num).toBeLessThan(1000000);
      }
    });

    it('correctly hashes and verifies OTP using constant-time comparison', () => {
      const secret = 'super_secret_key_32_characters_long_12345';
      const otp = '582914';
      const hash = hashOtp(otp, secret);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64); // sha256 hex length
      expect(verifyOtpHash(otp, hash, secret)).toBe(true);
      expect(verifyOtpHash('000000', hash, secret)).toBe(false);
      expect(verifyOtpHash('582915', hash, secret)).toBe(false);
    });

    it('encrypts and decrypts payloads with AES-256-GCM', () => {
      const key = '01234567890123456789012345678901'; // 32 bytes
      const plaintext = JSON.stringify({ otp: '123456', email: 'test@example.com' });

      const encrypted = encryptPayload(plaintext, key);
      expect(encrypted.ciphertext).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.tag).toBeDefined();

      const decrypted = decryptPayload(encrypted, key);
      expect(decrypted).toBe(plaintext);
    });

    it('fails decryption when ciphertext or tag is tampered', () => {
      const key = '01234567890123456789012345678901';
      const encrypted = encryptPayload('hello secret', key);

      // Tamper ciphertext
      const tampered = { ...encrypted, ciphertext: encrypted.ciphertext.slice(0, -2) + 'aa' };
      expect(() => decryptPayload(tampered, key)).toThrow();
    });
  });

  describe('Validation & Normalization', () => {
    it('normalizes standard and gmail email addresses consistently', () => {
      expect(normalizeEmail('  User.Name+Tag@gmail.com ')).toBe('username@gmail.com');
      expect(normalizeEmail('Hello@EXAMPLE.COM')).toBe('hello@example.com');
      expect(normalizeEmail('Jane.Doe@company.org')).toBe('jane.doe@company.org');
    });

    it('validates Idempotency-Key UUID v4 format', () => {
      const validKey = 'c9a646d3-9c61-4091-bf96-72412e87fc4b';
      expect(idempotencyKeyHeaderSchema.safeParse(validKey).success).toBe(true);

      const invalidKey = 'not-a-uuid';
      expect(idempotencyKeyHeaderSchema.safeParse(invalidKey).success).toBe(false);

      const emptyKey = '';
      expect(idempotencyKeyHeaderSchema.safeParse(emptyKey).success).toBe(false);
    });

    it('validates and normalizes sendOtp schema', () => {
      const parsed = sendOtpSchema.safeParse({ email: ' John.Doe@Gmail.com ' });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.email).toBe('johndoe@gmail.com');
      }

      const invalid = sendOtpSchema.safeParse({ email: 'not-an-email' });
      expect(invalid.success).toBe(false);
    });
  });

  describe('Logger Secret Redaction', () => {
    it('redacts sensitive keys from objects recursively', () => {
      const raw = {
        email: 'user@example.com',
        otp: '123456',
        nested: {
          secret: 'shhh',
          sessionId: 'sess_123',
          normal: 'ok',
        },
      };

      const redacted = redactSensitiveData(raw) as any;
      expect(redacted.email).toBe('user@example.com');
      expect(redacted.otp).toBe('[REDACTED]');
      expect(redacted.nested.secret).toBe('[REDACTED]');
      expect(redacted.nested.sessionId).toBe('[REDACTED]');
      expect(redacted.nested.normal).toBe('ok');
    });
  });

  describe('Environment Validation', () => {
    it('rejects environment variables when secrets are too short', () => {
      expect(() =>
        validateEnv({
          NODE_ENV: 'production',
          MONGO_URI: 'mongodb://localhost:27017/test',
          SESSION_SECRET: 'short',
          OTP_HMAC_SECRET: 'short',
          IDEMPOTENCY_HMAC_SECRET: 'short',
          EMAIL_ENCRYPTION_KEY: 'short',
        })
      ).toThrow(/Environment configuration error/);
    });
  });
});

