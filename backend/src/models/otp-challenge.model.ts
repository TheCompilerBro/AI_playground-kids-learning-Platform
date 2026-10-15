import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOTPChallenge extends Document {
  challengeId: string;
  emailNormalized: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  consumedAt?: Date | null;
  supersededAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const otpChallengeSchema = new Schema<IOTPChallenge>(
  {
    challengeId: {
      type: String,
      required: true,
      unique: true,
    },
    emailNormalized: {
      type: String,
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
    supersededAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
otpChallengeSchema.index({ emailNormalized: 1, createdAt: -1 });
// TTL index to automatically purge old challenges 24 hours after expiration
otpChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

export const OTPChallengeModel: Model<IOTPChallenge> =
  mongoose.models.OTPChallenge || mongoose.model<IOTPChallenge>('OTPChallenge', otpChallengeSchema);

