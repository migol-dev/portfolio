import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { createSession } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  // Ventana estricta para dificultar ataques de fuerza bruta.
  const limited = rateLimit(`login:${ip}`, { limit: 8, windowMs: 15 * 60 * 1000 });
  if (!limited.success) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  // Comparación en tiempo constante contra un hash "dummy" cuando el usuario no
  // existe, para no filtrar por temporización si un email existe o no.
  const dummyHash = "$2a$12$CwTycUXWue0Thq9StjUM0uJ8V.5Q0m6M4jQ4v3f4ELN6NcJ4WuBpq";
  const isValid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? dummyHash);

  if (!user || !isValid) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
  }

  await createSession({ sub: user.id, email: user.email });

  return NextResponse.json({ ok: true });
}
