import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env.MONGOMS_SYSTEM_BINARY = '/opt/homebrew/bin/mongod';

let mongod: MongoMemoryServer | null = null;

import { initializeIndexes } from '../src/config/init-indexes.js';

export async function setupTestDatabase(): Promise<string> {
  if (!mongod) {
    mongod = await MongoMemoryServer.create({
      binary: {
        systemBinary: '/opt/homebrew/bin/mongod',
      },
    });
    const uri = mongod.getUri();
    await mongoose.connect(uri, {
      directConnection: true,
      serverSelectionTimeoutMS: 5000,
    });
    await initializeIndexes();
    return uri;
  }
  return mongod.getUri();
}

export async function teardownTestDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
}

export async function clearDatabaseCollections(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}
