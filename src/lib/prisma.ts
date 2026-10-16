import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Usamos la URL de conexión preservando parámetros de query para SSL y pooling si existen
const connectionString = process.env.DATABASE_URL || "";
const isLocal =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

// rejectUnauthorized solo se desactiva si explícitamente se permite autofirmado en desarrollo
const allowSelfSigned =
  process.env.DB_ALLOW_SELF_SIGNED === "true" || process.env.NODE_ENV !== "production";
const caCert = process.env.DATABASE_CA_CERT;

let sslConfig: boolean | { rejectUnauthorized: boolean; ca?: string } = false;
if (!isLocal && connectionString) {
  sslConfig = {
    rejectUnauthorized: !allowSelfSigned,
    ...(caCert ? { ca: caCert } : {}),
  };
}

const pool = new Pool({
  connectionString,
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
