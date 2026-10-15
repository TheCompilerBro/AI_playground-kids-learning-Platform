import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { initializeIndexes } from './config/init-indexes.js';
import { emailOutboxWorker } from './workers/email-outbox.worker.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  try {
    logger.info('Starting Authentication System Server...');

    // 1. Connect to MongoDB
    await connectDatabase();

    // 2. Initialize Indexes
    await initializeIndexes();

    // 3. Start background Transactional Email Outbox Worker
    emailOutboxWorker.start();

    // 4. Create and start HTTP Application
    const app = createApp();
    const server = app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`CORS allowed origin: ${env.FRONTEND_URL}`);
    });

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, initiating graceful shutdown...`);

      emailOutboxWorker.stop();

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force shutdown after 10 seconds if hanging
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Fatal bootstrap error', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

bootstrap();

