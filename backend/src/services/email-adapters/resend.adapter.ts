import { Resend } from 'resend';
import { IEmailAdapter, SendEmailParams, SendEmailResult } from './email-adapter.interface.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export class ResendAdapter implements IEmailAdapter {
  private client: Resend;

  constructor(apiKey?: string) {
    const key = apiKey || env.RESEND_API_KEY;
    if (!key) {
      throw new Error('RESEND_API_KEY is required for ResendAdapter');
    }
    this.client = new Resend(key);
  }

  async send(params: SendEmailParams): Promise<SendEmailResult> {
    try {
      const response = await this.client.emails.send({
        from: env.EMAIL_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        headers: params.idempotencyKey ? { 'X-Entity-Ref-ID': params.idempotencyKey } : undefined,
      });

      if (response.error) {
        throw new Error(`Resend provider error: ${response.error.message}`);
      }

      const providerMessageId = response.data?.id || `resend_${Date.now()}`;
      logger.info('Email accepted by Resend provider', {
        recipientDomain: params.to.split('@')[1],
        providerMessageId,
      });

      return {
        providerMessageId,
        accepted: true,
      };
    } catch (error) {
      logger.error('Resend provider email dispatch failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

