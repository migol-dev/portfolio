import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { createSession } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyOrigin, readJsonLimited, jsonResponse } from "@/lib/security";

export async function POST(req: NextRequest) {
  if (!verifyOrigin(req)) {
    return jsonResponse({ error: "Origen no autorizado." }, { status: 403 });
  }

  const ip = getClientIp(req.headers);

  // Rate limit por IP
  const ipLimited = rateLimit(`login:ip:${ip}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!ipLimited.success) {
    return jsonResponse(
      { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
      {
        status: 429,
        headers: { "Retry-After": String(ipLimited.retryAfter) },
      }
    );
  }

  const { data: body, error: jsonError } = await readJsonLimited(req, 8_192);
  if (jsonError) return jsonError;

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({ error: "Credenciales inválidas." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  // Rate limit compuesto por email
  const emailLimited = rateLimit(`login:email:${email}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!emailLimited.success) {
    return jsonResponse(
      { error: "Demasiados intentos para esta cuenta. Espera unos minutos." },
      {
        status: 429,
        headers: { "Retry-After": String(emailLimited.retryAfter) },
      }
    );
  }

  let user = null;
  try {
    user = await prisma.adminUser.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("[POST /api/auth/login] Error en base de datos:", error);
    return jsonResponse({ error: "Error al verificar credenciales." }, { status: 500 });
  }

  // Comparación en tiempo constante contra hash dummy si el usuario no existe
  const dummyHash = "$2a$12$CwTycUXWue0Thq9StjUM0uJ8V.5Q0m6M4jQ4v3f4ELN6NcJ4WuBpq";
  const isValid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? dummyHash);

  if (!user || !isValid) {
    return jsonResponse({ error: "Credenciales inválidas." }, { status: 401 });
  }

  await createSession({ sub: user.id, email: user.email });

  return jsonResponse({ ok: true });
}
