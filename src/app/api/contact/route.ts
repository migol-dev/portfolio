import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limited.success) {
    return NextResponse.json(
      { error: "Demasiados mensajes enviados. Intenta de nuevo más tarde." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Honeypot: si el campo oculto "company" viene relleno, es un bot.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true }); // respuesta silenciosa, no delatamos el honeypot
  }

  if (!process.env.DATABASE_URL) {
    console.error("[contact] DATABASE_URL no configurado, mensaje no guardado:", parsed.data);
    return NextResponse.json(
      { error: "El formulario aún no está conectado a la base de datos." },
      { status: 503 }
    );
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        ip,
      },
    });
  } catch (error) {
    console.error("[contact] error al guardar mensaje:", error);
    return NextResponse.json({ error: "No se pudo enviar el mensaje." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
