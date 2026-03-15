/**
 * Prisma Client Setup
 * Uses PrismaPg driver adapter for PostgreSQL. Singleton in development to avoid multiple connections.
 * @see https://www.prisma.io/docs/orm/overview/databases/postgresql#pg-and-prismapg
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../app/generated/prisma";

const pool = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prismaClient = new PrismaClient({
  adapter: pool,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Gracefully disconnect Prisma on application shutdown
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
