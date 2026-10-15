import { IdempotencyRecordModel, IIdempotencyRecord } from '../models/idempotency-record.model.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export type AcquireResult =
  | { status: 'ACQUIRED'; record: IIdempotencyRecord }
  | { status: 'COMPLETED'; responseStatus: number; responseBody: Record<string, unknown> | null }
  | { status: 'PROCESSING'; retryAfter: number }
  | { status: 'MISMATCH'; message: string };

export class IdempotencyService {
  /**
   * Atomically acquires an idempotency lease for the given key and scope
   */
  async acquire(params: {
    scopeHash: string;
    key: string;
    operation: string;
    requestFingerprint: string;
    ownerToken?: string;
  }): Promise<AcquireResult> {
    const { scopeHash, key, operation, requestFingerprint, ownerToken } = params;
    const now = new Date();
    const leaseExpiresAt = new Date(now.getTime() + env.IDEMPOTENCY_LEASE_SECONDS * 1000);
    const expiresAt = new Date(now.getTime() + env.IDEMPOTENCY_RETENTION_HOURS * 3600 * 1000);

    // Check if an existing record exists
    const existing = await IdempotencyRecordModel.findOne({ scopeHash, key });

    if (existing) {
      // Explicit application-level expiration check
      if (existing.expiresAt && existing.expiresAt < now) {
        logger.info('Purging expired idempotency record during acquire', { key });
        await IdempotencyRecordModel.deleteOne({ _id: existing._id });
      } else {
        // Fingerprint check: Mismatch must be rejected with 422
        if (existing.requestFingerprint !== requestFingerprint) {
          logger.warn('Idempotency key payload mismatch detected', { key, operation });
          return {
            status: 'MISMATCH',
            message: 'Idempotency key was previously used with a different request payload or endpoint',
          };
        }

        // Already completed: Replay original safe response without re-executing
        if (existing.status === 'COMPLETED') {
          logger.info('Returning cached safe response for completed idempotency key', { key, operation });
          return {
            status: 'COMPLETED',
            responseStatus: existing.responseStatus || 200,
            responseBody: existing.safeResponseBody || null,
          };
        }

        // Currently processing: Check if lease has expired
        if (existing.status === 'PROCESSING') {
          if (existing.leaseExpiresAt && existing.leaseExpiresAt < now) {
            logger.warn('Idempotency processing lease expired, renewing lease for retry', { key });
            existing.leaseExpiresAt = leaseExpiresAt;
            existing.ownerToken = ownerToken;
            await existing.save();
            return { status: 'ACQUIRED', record: existing };
          }

          logger.info('Request with this idempotency key is currently processing', { key });
          return {
            status: 'PROCESSING',
            retryAfter: 2,
          };
        }

        // If previously failed, allow retry by updating lease
        if (existing.status === 'FAILED') {
          existing.status = 'PROCESSING';
          existing.leaseExpiresAt = leaseExpiresAt;
          existing.ownerToken = ownerToken;
          await existing.save();
          return { status: 'ACQUIRED', record: existing };
        }
      }
    }

    // Try to atomically insert new record
    try {
      const record = await IdempotencyRecordModel.create({
        scopeHash,
        key,
        operation,
        requestFingerprint,
        status: 'PROCESSING',
        ownerToken,
        leaseExpiresAt,
        expiresAt,
      });

      return { status: 'ACQUIRED', record };
    } catch (err: unknown) {
      // Handle race condition: MongoDB duplicate key error (code 11000)
      const error = err as { code?: number };
      if (error.code === 11000) {
        logger.info('Concurrent creation detected for idempotency key, falling back to read', { key });
        // Re-read to handle concurrent winner
        return this.acquire(params);
      }
      throw err;
    }
  }

  /**
   * Finalizes the idempotency record with the safe response payload and COMPLETED status
   */
  async complete(
    scopeHash: string,
    key: string,
    responseStatus: number,
    safeResponseBody: Record<string, unknown>
  ): Promise<void> {
    await IdempotencyRecordModel.updateOne(
      { scopeHash, key },
      {
        $set: {
          status: 'COMPLETED',
          responseStatus,
          safeResponseBody,
          updatedAt: new Date(),
        },
      }
    );
  }

  /**
   * Marks the idempotency record as FAILED or cleans up for transient retry
   */
  async fail(scopeHash: string, key: string, isDeterministicFailure = false): Promise<void> {
    if (isDeterministicFailure) {
      await IdempotencyRecordModel.updateOne(
        { scopeHash, key },
        {
          $set: {
            status: 'FAILED',
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // For transient failures (e.g. database timeout), delete so client can retry immediately
      await IdempotencyRecordModel.deleteOne({ scopeHash, key });
    }
  }
}

export const idempotencyService = new IdempotencyService();

