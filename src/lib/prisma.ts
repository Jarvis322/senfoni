import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Tarayıcı ortamında çalışmayı engelle
if (typeof window !== 'undefined') {
  throw new Error('PrismaClient tarayıcı ortamında çalıştırılamaz');
}

// Sunucu tarafında global nesneye PrismaClient'ı ekle
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 