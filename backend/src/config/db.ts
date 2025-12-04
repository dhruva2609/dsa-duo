import { PrismaClient } from '@prisma/client';

console.log('Initializing Prisma Client...');

let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  console.log('Prisma Client initialized successfully.');
} catch (e) {
  console.error('Failed to initialize Prisma Client:', e);
  // Exit the process if Prisma fails to initialize
  process.exit(1);
}

export default prisma;