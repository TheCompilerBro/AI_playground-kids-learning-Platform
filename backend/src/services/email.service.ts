import { IEmailAdapter, SendEmailParams, SendEmailResult } from './email-adapters/email-adapter.interface.js';
import { ResendAdapter } from './email-adapters/resend.adapter.js';
import { SmtpAdapter } from './email-adapters/smtp.adapter.js';
import { TestEmailAdapter } from './email-adapters/test.adapter.js';
import { env } from '../config/env.js';

export class EmailService {
  private adapter: IEmailAdapter;

  constructor(customAdapter?: IEmailAdapter) {
    if (customAdapter) {
      this.adapter = customAdapter;
    } else if (env.NODE_ENV === 'test' || env.EMAIL_PROVIDER === 'test') {
      this.adapter = new TestEmailAdapter();
    } else if (env.EMAIL_PROVIDER === 'resend') {
      this.adapter = new ResendAdapter();
    } else {
      this.adapter = new SmtpAdapter();
    }
  }

  setAdapter(adapter: IEmailAdapter): void {
    this.adapter = adapter;
  }

  getAdapter(): IEmailAdapter {
    return this.adapter;
  }

  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    return this.adapter.send(params);
  }
}

export const emailService = new EmailService();

