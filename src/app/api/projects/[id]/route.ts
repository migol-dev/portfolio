import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projectSchema, idParamSchema } from "@/lib/validations";
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

  const { data: body, error: jsonError } = await readJsonLimited(req, 32_768);
  if (jsonError) return jsonError;

  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return jsonResponse(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.update({
      where: { id: idParsed.data },
      data: parsed.data,
    });

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("[revalidatePath] Error al invalidar caché:", e);
    }

    return jsonResponse(project);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return jsonResponse({ error: "Proyecto no encontrado." }, { status: 404 });
    }
    console.error("[PUT /api/projects/:id] Error al actualizar:", error);
    return jsonResponse({ error: "No se pudo actualizar el proyecto." }, { status: 500 });
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
    await prisma.project.delete({ where: { id: idParsed.data } });

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("[revalidatePath] Error al invalidar caché:", e);
    }

    return jsonResponse({ ok: true });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return jsonResponse({ error: "Proyecto no encontrado." }, { status: 404 });
    }
    console.error("[DELETE /api/projects/:id] Error al eliminar:", error);
    return jsonResponse({ error: "No se pudo eliminar el proyecto." }, { status: 500 });
  }
}
