import mongoose, { Document, Schema, Model } from 'mongoose';
import type { EmailDeliveryStatus } from '../types/index.js';

export interface IEmailOutbox extends Document {
  eventId: string;
  eventType: string;
  recipient: string;
  encryptedPayload: string; // JSON with AES-256-GCM ciphertext, iv, tag
  status: EmailDeliveryStatus;
  attempts: number;
  nextAttemptAt: Date;
  providerMessageId?: string | null;
  lastErrorCode?: string | null;
  lastErrorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const emailOutboxSchema = new Schema<IEmailOutbox>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    eventType: {
      type: String,
      required: true,
      default: 'SEND_OTP',
    },
    recipient: {
      type: String,
      required: true,
      index: true,
    },
    encryptedPayload: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'SENDING', 'SENT', 'FAILED', 'DEAD_LETTER'],
      default: 'PENDING',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    nextAttemptAt: {
      type: Date,
      required: true,
    },
    providerMessageId: {
      type: String,
      default: null,
    },
    lastErrorCode: {
      type: String,
      default: null,
    },
    lastErrorMessage: {
      type: String,
      default: null,
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

// Indexes
emailOutboxSchema.index({ status: 1, nextAttemptAt: 1 });
emailOutboxSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailOutboxModel: Model<IEmailOutbox> =
  mongoose.models.EmailOutbox || mongoose.model<IEmailOutbox>('EmailOutbox', emailOutboxSchema);

