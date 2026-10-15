import mongoose, { ClientSession } from 'mongoose';
import dns from 'node:dns';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Ensure SRV lookups work reliably on macOS / ISP resolvers that reject SRV queries
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore if custom DNS servers cannot be set in this environment
}

let isConnected = false;
let supportsTransactions = false;

export async function connectDatabase(customUri?: string): Promise<typeof mongoose> {
  const uri = customUri || env.MONGO_URI;

  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    logger.info('Connected to MongoDB successfully');

    // Check if replica set is enabled to support transactions
    try {
      const adminDb = mongoose.connection.db?.admin();
      if (adminDb) {
        const buildInfo = await adminDb.command({ isMaster: 1 });
        supportsTransactions = Boolean(buildInfo.setName);
      }
    } catch {
      supportsTransactions = false;
    }

    logger.info(`MongoDB transaction support: ${supportsTransactions ? 'ENABLED' : 'DISABLED (standalone mode)'}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('Disconnected from MongoDB');
  }
}

/**
 * Executes a callback within a MongoDB transaction if the server supports it,
 * or runs directly if running on a standalone database.
 */
export async function withTransaction<T>(
  callback: (session: ClientSession | null) => Promise<T>
): Promise<T> {
  if (!supportsTransactions) {
    return await callback(null);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

export function getTransactionSupport(): boolean {
  return supportsTransactions;
}

