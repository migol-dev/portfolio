import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { patchMessageSchema, idParamSchema } from "@/lib/validations";
import { verifyOrigin, readJsonLimited, jsonResponse, requireAdmin } from "@/lib/security";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!verifyOrigin(req)) {
    return jsonResponse({ error: "Origen no autorizado." }, { status: 403 });
  }

  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  const idParsed = idParamSchema.safeParse(id);
  if (!idParsed.success) {
    return jsonResponse({ error: "Identificador inválido." }, { status: 400 });
  }

  const { data: body, error: jsonError } = await readJsonLimited(req, 8_192);
  if (jsonError) return jsonError;

  const parsed = patchMessageSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const message = await prisma.contactMessage.update({
      where: { id: idParsed.data },
      data: { read: parsed.data.read },
    });
    return jsonResponse(message);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return jsonResponse({ error: "Mensaje no encontrado." }, { status: 404 });
    }
    console.error("[PATCH /api/messages/:id] Error al actualizar:", error);
    return jsonResponse({ error: "No se pudo actualizar el mensaje." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!verifyOrigin(req)) {
    return jsonResponse({ error: "Origen no autorizado." }, { status: 403 });
  }

  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  const idParsed = idParamSchema.safeParse(id);
  if (!idParsed.success) {
    return jsonResponse({ error: "Identificador inválido." }, { status: 400 });
  }

  try {
    await prisma.contactMessage.delete({ where: { id: idParsed.data } });
    return jsonResponse({ ok: true });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return jsonResponse({ error: "Mensaje no encontrado." }, { status: 404 });
    }
    console.error("[DELETE /api/messages/:id] Error al eliminar:", error);
    return jsonResponse({ error: "No se pudo eliminar el mensaje." }, { status: 500 });
  }
}
