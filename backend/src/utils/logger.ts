export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_KEYS = new Set([
  'otp',
  'otphash',
  'code',
  'password',
  'secret',
  'session',
  'sessionid',
  'token',
  'authorization',
  'cookie',
  'set-cookie',
  'apikey',
  'resend_api_key',
  'smtp_pass',
  'email_encryption_key',
  'encryptedpayload',
]);

/**
 * Deeply redacts sensitive fields from objects before logging
 */
export function redactSensitiveData(obj: unknown, depth = 0): unknown {
  if (depth > 5) return '[DEPTH_LIMIT]';
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveData(item, depth + 1));
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey) || lowerKey.includes('secret') || lowerKey.includes('password')) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = redactSensitiveData(value, depth + 1);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export class Logger {
  private context: string;

  constructor(context = 'App') {
    this.context = context;
  }

  private formatMessage(level: LogLevel, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const safeMeta = meta !== undefined ? redactSensitiveData(meta) : undefined;
    const metaString = safeMeta !== undefined ? ` | ${JSON.stringify(safeMeta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}]: ${message}${metaString}`;
  }

  debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV !== 'test') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  info(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV !== 'test') {
      console.log(this.formatMessage('info', message, meta));
    }
  }

  warn(message: string, meta?: unknown): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, meta?: unknown): void {
    console.error(this.formatMessage('error', message, meta));
  }
}

export const logger = new Logger('AuthSystem');

