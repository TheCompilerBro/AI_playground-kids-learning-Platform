import { IEmailAdapter, SendEmailParams, SendEmailResult } from './email-adapter.interface.js';

export interface RecordedEmail extends SendEmailParams {
  sentAt: Date;
  providerMessageId: string;
}

export class TestEmailAdapter implements IEmailAdapter {
  public sentEmails: RecordedEmail[] = [];
  public shouldFail = false;
  public failureError = new Error('Simulated provider failure');

  async send(params: SendEmailParams): Promise<SendEmailResult> {
    if (this.shouldFail) {
      throw this.failureError;
    }

    const providerMessageId = `test_msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    this.sentEmails.push({
      ...params,
      sentAt: new Date(),
      providerMessageId,
    });

    return {
      providerMessageId,
      accepted: true,
    };
  }

  clear(): void {
    this.sentEmails = [];
    this.shouldFail = false;
  }
}

