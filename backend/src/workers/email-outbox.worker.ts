import { EmailOutboxModel, IEmailOutbox } from '../models/email-outbox.model.js';
import { emailService } from '../services/email.service.js';
import { decryptPayload, EncryptedData } from '../utils/crypto.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class EmailOutboxWorker {
  private timer: NodeJS.Timeout | null = null;
  private running = false;
  private isProcessing = false;
  private pollIntervalMs: number;

  constructor(pollIntervalMs = 2000) {
    this.pollIntervalMs = pollIntervalMs;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    logger.info('Email outbox worker started', { pollIntervalMs: this.pollIntervalMs });

    this.timer = setInterval(async () => {
      if (!this.isProcessing && this.running) {
        try {
          await this.processBatch();
        } catch (error) {
          logger.error('Error during email outbox worker cycle', {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }, this.pollIntervalMs);
  }

  stop(): void {
    this.running = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    logger.info('Email outbox worker stopped');
  }

  /**
   * Processes a single batch of pending outbox emails
   */
  async processBatch(batchSize = 10): Promise<number> {
    this.isProcessing = true;
    let processedCount = 0;

    try {
      const now = new Date();
      // Find candidate jobs
      const candidates = await EmailOutboxModel.find({
        status: { $in: ['PENDING', 'FAILED'] },
        nextAttemptAt: { $lte: now },
      })
        .limit(batchSize)
        .exec();

      for (const item of candidates) {
        // Atomically claim lease
        const claimed = await EmailOutboxModel.findOneAndUpdate(
          {
            _id: item._id,
            status: item.status, // optimistic concurrency check
          },
          {
            $set: { status: 'SENDING', updatedAt: new Date() },
          },
          { new: true }
        );

        if (!claimed) {
          continue; // Another worker claimed this job
        }

        await this.deliverEmail(claimed);
        processedCount++;
      }
    } finally {
      this.isProcessing = false;
    }

    return processedCount;
  }

  private async deliverEmail(job: IEmailOutbox): Promise<void> {
    try {
      // 1. Decrypt payload
      const encryptedData: EncryptedData = JSON.parse(job.encryptedPayload);
      const decryptedString = decryptPayload(encryptedData, env.EMAIL_ENCRYPTION_KEY);
      const payload: { otp: string; email: string } = JSON.parse(decryptedString);

      const html = `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
          <h2 style="color: #6558e8;">Your Verification Code</h2>
          <p>Please use the following 6-digit code to sign in to your account. This code is valid for 5 minutes.</p>
          <div style="background-color: #f4f3ff; border: 1px dashed #6558e8; padding: 16px; font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; color: #17233c; margin: 20px 0;">
            ${payload.otp}
          </div>
          <p style="color: #64748b; font-size: 13px;">If you did not request this verification code, please ignore this email.</p>
        </div>
      `;

      const text = `Your verification code is: ${payload.otp}. Valid for 5 minutes.`;

      // 2. Dispatch via active email service
      const result = await emailService.sendEmail({
        to: payload.email,
        subject: 'Your One-Time Login Code',
        html,
        text,
        idempotencyKey: job.eventId,
      });

      // 3. Mark job as SENT
      await EmailOutboxModel.updateOne(
        { _id: job._id },
        {
          $set: {
            status: 'SENT',
            providerMessageId: result.providerMessageId,
            updatedAt: new Date(),
          },
        }
      );

      logger.info('Outbox email job completed successfully', {
        eventId: job.eventId,
        providerMessageId: result.providerMessageId,
      });
    } catch (error) {
      const attempts = job.attempts + 1;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Dead letter after 5 attempts
      if (attempts >= 5) {
        await EmailOutboxModel.updateOne(
          { _id: job._id },
          {
            $set: {
              status: 'DEAD_LETTER',
              attempts,
              lastErrorMessage: errorMessage,
              updatedAt: new Date(),
            },
          }
        );
        logger.error('Outbox email moved to DEAD_LETTER after max attempts', {
          eventId: job.eventId,
          attempts,
        });
      } else {
        // Bounded exponential backoff with jitter
        const baseDelayMs = Math.pow(2, attempts) * 1000;
        const jitterMs = Math.floor(Math.random() * 500);
        const backoffMs = Math.min(30000, baseDelayMs + jitterMs);
        const nextAttemptAt = new Date(Date.now() + backoffMs);

        await EmailOutboxModel.updateOne(
          { _id: job._id },
          {
            $set: {
              status: 'FAILED',
              attempts,
              nextAttemptAt,
              lastErrorMessage: errorMessage,
              updatedAt: new Date(),
            },
          }
        );

        logger.warn('Outbox email delivery failed, scheduled retry', {
          eventId: job.eventId,
          attempts,
          backoffMs,
        });
      }
    }
  }
}

export const emailOutboxWorker = new EmailOutboxWorker();

