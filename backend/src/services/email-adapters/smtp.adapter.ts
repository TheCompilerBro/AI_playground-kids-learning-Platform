import nodemailer, { Transporter } from 'nodemailer';
import { IEmailAdapter, SendEmailParams, SendEmailResult } from './email-adapter.interface.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export class SmtpAdapter implements IEmailAdapter {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || 'localhost',
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_SECURE || false,
      auth:
        env.SMTP_USER && env.SMTP_PASS
          ? {
              user: env.SMTP_USER,
              pass: env.SMTP_PASS,
            }
          : undefined,
    });
  }

  async send(params: SendEmailParams): Promise<SendEmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        messageId: params.idempotencyKey ? `<${params.idempotencyKey}@auth.app>` : undefined,
      });

      const providerMessageId = info.messageId || `smtp_${Date.now()}`;
      logger.info('Email delivered via SMTP provider', {
        recipientDomain: params.to.split('@')[1],
        providerMessageId,
      });

      return {
        providerMessageId,
        accepted: true,
      };
    } catch (error) {
      logger.error('SMTP email dispatch failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

