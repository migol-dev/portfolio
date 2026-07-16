import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Obtenemos la URL y eliminamos CUALQUIER parámetro de SSL que venga en el string
// para que no sobrescriba nuestra configuración de abajo.
const rawUrl = process.env.DATABASE_URL || "";
const connectionString = rawUrl.split("?")[0];

const sslConfig =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
    ? false
    : {
        rejectUnauthorized: false, // Forzamos la aceptación del certificado
      };

const pool = new Pool({
  connectionString, // Usamos la URL limpia (sin sslmode=...)
  ssl: sslConfig,
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
