import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { authRoutes } from './routes/auth.routes.js';
import { globalRateLimiter } from './middleware/rate-limit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openapiDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'docs/openapi.json'), 'utf8')
);

export function createApp(customSessionStore?: session.Store): Express {
  const app = express();

  // Trust proxy for secure cookies and accurate IP rate limiting behind reverse proxies
  app.set('trust proxy', 1);

  // CORS configuration
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Client-Flow-Id'],
    })
  );

  // Request size limits
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Global rate limiter
  app.use(globalRateLimiter);

  // Session store configuration
  const sessionStore =
    customSessionStore ||
    MongoStore.create({
      clientPromise: mongoose.connection.asPromise().then((m) => m.getClient() as any),
      collectionName: 'sessions',
      ttl: env.SESSION_MAX_AGE_MINUTES * 60,
      autoRemove: 'native',
    });

  const isProduction = env.NODE_ENV === 'production';

  app.use(
    session({
      name: 'connect.sid',
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: env.SESSION_MAX_AGE_MINUTES * 60 * 1000,
        path: '/',
      },
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  });

  // Swagger / OpenAPI documentation endpoint
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

  // Mount Authentication APIs
  app.use('/api/auth', authRoutes);

  // 404 handler for unknown routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint does not exist',
      },
    });
  });

  // Centralized Error Middleware
  app.use(errorHandler);

  return app;
}

