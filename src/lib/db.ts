import { Pool as NeonPool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool as PgPool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

let prismaInstance: PrismaClient;

if (connectionString && connectionString.includes('neon.tech')) {
  const pool = new NeonPool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  prismaInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
} else {
  const pool = new PgPool({ connectionString });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

