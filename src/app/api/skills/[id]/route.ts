import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { skillSchema, idParamSchema } from "@/lib/validations";
import { verifyOrigin, readJsonLimited, jsonResponse, requireAdmin } from "@/lib/security";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
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

  const { data: body, error: jsonError } = await readJsonLimited(req, 16_384);
  if (jsonError) return jsonError;

  const parsed = skillSchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonResponse(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const skill = await prisma.skill.update({
      where: { id: idParsed.data },
      data: parsed.data,
    });

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("[revalidatePath] Error al invalidar caché:", e);
    }

    return jsonResponse(skill);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return jsonResponse({ error: "Habilidad no encontrada." }, { status: 404 });
    }
    console.error("[PUT /api/skills/:id] Error al actualizar:", error);
    return jsonResponse({ error: "No se pudo actualizar la habilidad." }, { status: 500 });
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
    await prisma.skill.delete({ where: { id: idParsed.data } });

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("[revalidatePath] Error al invalidar caché:", e);
    }

    return jsonResponse({ ok: true });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return jsonResponse({ error: "Habilidad no encontrada." }, { status: 404 });
    }
    console.error("[DELETE /api/skills/:id] Error al eliminar:", error);
    return jsonResponse({ error: "No se pudo eliminar la habilidad." }, { status: 500 });
  }
}
