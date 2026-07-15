import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Crear pool de conexiones con configuración SSL
const connectionString = process.env.DATABASE_URL;
const isDevelopment = process.env.NODE_ENV === "development";

// Configuración SSL para el Pool
// En desarrollo: permitir certificados autofirmados (Supabase)
// En producción: rechazarlos para mayor seguridad
const sslConfig =
  isDevelopment && !connectionString?.includes("localhost")
    ? {
        rejectUnauthorized: false, // Permite certificados autofirmados en dev
      }
    : connectionString?.includes("localhost")
      ? false // Sin SSL para localhost
      : true; // SSL verificado en producción

const pool = new Pool({
  connectionString,
  ssl: sslConfig,
});

const adapter = new PrismaPg(pool);

// Evita crear múltiples instancias de PrismaClient en desarrollo
// (Next.js recarga módulos en caliente y agotaría las conexiones a Postgres).
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
