// File Path: lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// This is a TypeScript trick to ensure we only ever have one instance of the Prisma client.
// In a development environment, Next.js can clear the cache and re-run files, which
// would create multiple Prisma clients and exhaust the database connections. This prevents that.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Optional: logs database queries to your terminal
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;