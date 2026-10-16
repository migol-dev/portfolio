import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyOrigin, readJsonLimited, jsonResponse } from "@/lib/security";

export async function POST(req: NextRequest) {
  if (!verifyOrigin(req)) {
    return jsonResponse({ error: "Origen no autorizado." }, { status: 403 });
  }

  const ip = getClientIp(req.headers);

  const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limited.success) {
    return jsonResponse(
      { error: "Demasiados mensajes enviados. Intenta de nuevo más tarde." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      }
    );
  }

  const { data: body, error: jsonError } = await readJsonLimited(req, 16_384);
  if (jsonError) return jsonError;

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Honeypot: si el campo oculto "company" viene relleno, es un bot.
  if (parsed.data.company) {
    return jsonResponse({ ok: true }); // respuesta silenciosa
  }

  if (!process.env.DATABASE_URL) {
    console.warn("[contact] Base de datos no configurada, mensaje descartado de manera segura.");
    return jsonResponse(
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
    console.error("[contact] Error al persistir mensaje:", error);
    return jsonResponse({ error: "No se pudo enviar el mensaje." }, { status: 500 });
  }

  return jsonResponse({ ok: true });
}
