export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
}

export interface SendEmailResult {
  providerMessageId: string;
  accepted: boolean;
}

export interface IEmailAdapter {
  send(params: SendEmailParams): Promise<SendEmailResult>;
}

