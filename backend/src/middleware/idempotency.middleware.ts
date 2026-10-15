import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import { idempotencyKeyHeaderSchema } from '../validators/auth.validator.js';
import { computeRequestFingerprint, computeScopeHash } from '../utils/request-fingerprint.js';
import { idempotencyService } from '../services/idempotency.service.js';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { logger } from '../utils/logger.js';

export function idempotencyMiddleware(operationName: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const rawKey = req.header('Idempotency-Key');

    // 1. Validate Idempotency-Key header
    const validation = idempotencyKeyHeaderSchema.safeParse(rawKey);
    if (!validation.success) {
      const errorResponse: ApiResponse = {
        success: false,
        message: validation.error.errors[0]?.message || 'Invalid or missing Idempotency-Key header',
        data: null,
        error: {
          code: 'INVALID_IDEMPOTENCY_KEY',
          message: validation.error.errors[0]?.message || 'Idempotency-Key header is required and must be a valid UUID v4',
        },
      };
      res.status(400).json(errorResponse);
      return;
    }

    const key = validation.data;

    // 2. Derive privacy-preserving client scope
    let clientIdentifier: string;
    if (req.user?.id) {
      clientIdentifier = `user:${req.user.id}`;
    } else {
      // Anonymous flow identifier
      const flowIdHeader = req.header('X-Client-Flow-Id');
      if (flowIdHeader && /^[a-zA-Z0-9_-]{16,64}$/.test(flowIdHeader)) {
        clientIdentifier = `anon:${flowIdHeader}`;
      } else {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.header('user-agent') || 'unknown';
        const ipHash = crypto.createHash('sha256').update(`${ip}:${userAgent}`).digest('hex').slice(0, 32);
        clientIdentifier = `anon:${ipHash}`;
      }
    }

    const canonicalPath = req.baseUrl + req.path;
    const scopeHash = computeScopeHash(clientIdentifier, canonicalPath);
    const requestFingerprint = computeRequestFingerprint({
      method: req.method,
      path: canonicalPath,
      operation: operationName,
      body: req.body,
    });

    const ownerToken = crypto.randomUUID();

    try {
      const result = await idempotencyService.acquire({
        scopeHash,
        key,
        operation: operationName,
        requestFingerprint,
        ownerToken,
      });

      // Case D: Mismatched request fingerprint
      if (result.status === 'MISMATCH') {
        const response: ApiResponse = {
          success: false,
          message: result.message,
          data: null,
          error: {
            code: 'IDEMPOTENCY_KEY_REUSED',
            message: result.message,
          },
        };
        res.status(422).json(response);
        return;
      }

      // Case C: Concurrently processing
      if (result.status === 'PROCESSING') {
        res.setHeader('Retry-After', result.retryAfter.toString());
        const response: ApiResponse = {
          success: false,
          message: 'A request with this idempotency key is currently processing. Please retry shortly.',
          data: null,
          error: {
            code: 'OPERATION_IN_PROGRESS',
            message: 'Concurrent request in progress',
          },
        };
        res.status(409).json(response);
        return;
      }

      // Case B: Completed - Return cached safe response
      if (result.status === 'COMPLETED') {
        logger.info('Serving cached idempotent response', { key, operation: operationName });
        res.setHeader('X-Idempotent-Replay', 'true');
        res.status(result.responseStatus).json(result.responseBody);
        return;
      }

      // Case A: Newly Acquired Lease
      req.idempotencyRecord = result.record;

      // Intercept response to record completed safe payload
      const originalJson = res.json.bind(res);
      res.json = function (body: any): Response {
        const statusCode = res.statusCode;

        // Process completion asynchronously without blocking client response
        (async () => {
          try {
            if (statusCode >= 200 && statusCode < 300) {
              // Redact any accidental sensitive values before caching
              const safeBody = JSON.parse(JSON.stringify(body));
              await idempotencyService.complete(scopeHash, key, statusCode, safeBody);
            } else if (statusCode >= 400 && statusCode < 500) {
              // Deterministic client errors (e.g. 400 bad request, 401 invalid OTP) can be marked completed or failed
              await idempotencyService.complete(scopeHash, key, statusCode, body);
            } else {
              // 500 server error - allow retry
              await idempotencyService.fail(scopeHash, key, false);
            }
          } catch (err: any) {
            if (err?.name !== 'MongoNotConnectedError' && !err?.message?.includes('topology was closed')) {
              logger.error('Failed to complete idempotency record in response hook', { error: err?.message || err });
            }
          }
        })();

        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Unexpected error in idempotency middleware', { error });
      next(error);
    }
  };
}

