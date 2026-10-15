import { UserModel } from '../models/user.model.js';
import { OTPChallengeModel } from '../models/otp-challenge.model.js';
import { IdempotencyRecordModel } from '../models/idempotency-record.model.js';
import { EmailOutboxModel } from '../models/email-outbox.model.js';
import { normalizeEmail } from '../validators/auth.validator.js';
import { logger } from '../utils/logger.js';

export async function initializeIndexes(): Promise<void> {
  logger.info('Initializing MongoDB indexes...');

  // Automatically backfill emailNormalized for legacy user records if any exist
  try {
    const legacyUsers = await UserModel.find({
      $or: [
        { emailNormalized: { $exists: false } },
        { emailNormalized: null },
        { emailNormalized: '' },
      ],
      email: { $exists: true, $ne: null },
    }).select('_id email');

    if (legacyUsers.length > 0) {
      logger.info(`Backfilling emailNormalized for ${legacyUsers.length} legacy user records...`);
      for (const user of legacyUsers) {
        if (user.email) {
          const normalized = normalizeEmail(user.email);
          await UserModel.updateOne({ _id: user._id }, { $set: { emailNormalized: normalized } });
        }
      }
    }
  } catch (err) {
    logger.warn('Failed to backfill legacy users before index sync', {
      error: err instanceof Error ? err.message : String(err),
    });
  }

  await Promise.all([
    UserModel.syncIndexes(),
    OTPChallengeModel.syncIndexes(),
    IdempotencyRecordModel.syncIndexes(),
    EmailOutboxModel.syncIndexes(),
  ]);
  logger.info('MongoDB indexes synchronized successfully.');
}

