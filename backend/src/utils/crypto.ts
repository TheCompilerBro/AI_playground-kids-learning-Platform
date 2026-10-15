import crypto from 'crypto';

/**
 * Generates a cryptographically secure 6-digit OTP string (e.g. "482910")
 */
export function generateOtp(): string {
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}

/**
 * Computes an HMAC-SHA-256 hash of the OTP using the provided secret
 */
export function hashOtp(otp: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(otp).digest('hex');
}

/**
 * Verifies an OTP against a stored hash using constant-time comparison
 */
export function verifyOtpHash(otp: string, expectedHash: string, secret: string): boolean {
  const actualHash = hashOtp(otp, secret);
  const actualBuffer = Buffer.from(actualHash, 'utf8');
  const expectedBuffer = Buffer.from(expectedHash, 'utf8');

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

/**
 * Derives a 32-byte Buffer key from the provided string (handles 32 ascii chars or 64 hex chars)
 */
function deriveEncryptionKey(keyInput: string): Buffer {
  if (keyInput.length === 64 && /^[0-9a-fA-F]+$/.test(keyInput)) {
    return Buffer.from(keyInput, 'hex');
  }
  const buf = Buffer.from(keyInput, 'utf8');
  if (buf.length === 32) {
    return buf;
  }
  // If not exactly 32 bytes, use SHA-256 to derive a 32-byte key deterministically
  return crypto.createHash('sha256').update(buf).digest();
}

export interface EncryptedData {
  ciphertext: string; // hex
  iv: string; // hex
  tag: string; // hex
}

/**
 * Encrypts a plaintext payload using AES-256-GCM authenticated encryption
 */
export function encryptPayload(plaintext: string, secretKey: string): EncryptedData {
  const key = deriveEncryptionKey(secretKey);
  const iv = crypto.randomBytes(12); // standard 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  return {
    ciphertext,
    iv: iv.toString('hex'),
    tag,
  };
}

/**
 * Decrypts a payload encrypted with AES-256-GCM
 */
export function decryptPayload(encrypted: EncryptedData, secretKey: string): string {
  const key = deriveEncryptionKey(secretKey);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(encrypted.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));

  let plaintext = decipher.update(encrypted.ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');

  return plaintext;
}

