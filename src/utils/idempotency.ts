/**
 * Generates a standard RFC4122 version 4 UUID
 */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 compliant UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Key manager that maintains the active idempotency key for retries
 * until an operation completes or is explicitly reset
 */
export class IdempotencyManager {
  private currentKeys: Map<string, string> = new Map();

  /**
   * Gets the existing key for this operation, or generates a new one
   */
  getOrCreateKey(operationName: string): string {
    let key = this.currentKeys.get(operationName);
    if (!key) {
      key = generateIdempotencyKey();
      this.currentKeys.set(operationName, key);
    }
    return key;
  }

  /**
   * Resets the key for an operation when a genuinely new operation begins
   */
  rotateKey(operationName: string): string {
    const newKey = generateIdempotencyKey();
    this.currentKeys.set(operationName, newKey);
    return newKey;
  }

  /**
   * Clears the key after successful completion
   */
  clearKey(operationName: string): void {
    this.currentKeys.delete(operationName);
  }
}

export const idempotencyManager = new IdempotencyManager();

