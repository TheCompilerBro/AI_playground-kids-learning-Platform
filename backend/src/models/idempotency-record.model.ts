import mongoose, { Document, Schema, Model } from 'mongoose';
import type { IdempotencyStatus } from '../types/index.js';

export interface IIdempotencyRecord extends Document {
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

const idempotencyRecordSchema = new Schema<IIdempotencyRecord>(
  {
    scopeHash: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    operation: {
      type: String,
      required: true,
    },
    requestFingerprint: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PROCESSING',
      required: true,
    },
    responseStatus: {
      type: Number,
    },
    safeResponseBody: {
      type: Schema.Types.Mixed,
      default: null,
    },
    ownerToken: {
      type: String,
    },
    leaseExpiresAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index on scopeHash and idempotency key
idempotencyRecordSchema.index({ scopeHash: 1, key: 1 }, { unique: true });

// TTL index on expiresAt for eventual MongoDB cleanup
idempotencyRecordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const IdempotencyRecordModel: Model<IIdempotencyRecord> =
  mongoose.models.IdempotencyRecord ||
  mongoose.model<IIdempotencyRecord>('IdempotencyRecord', idempotencyRecordSchema);

