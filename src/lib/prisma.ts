import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Limpiamos la URL para evitar conflictos con sslmode=verify-full de la cadena
const rawConnectionString = process.env.DATABASE_URL || "";
const connectionString = rawConnectionString.split("?")[0];

const sslConfig =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
    ? false
    : {
        rejectUnauthorized: false, // Permite conectar a Supabase sin el certificado CA
      };

const pool = new Pool({
  connectionString: rawConnectionString, // Usamos la original por si tiene otros params
  ssl: sslConfig,                        // Pero sobreescribimos el SSL aquí
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
