import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { verifyOrigin, readJsonLimited, jsonResponse, requireAdmin } from "@/lib/security";
import { FALLBACK_PROJECTS } from "@/lib/fallback-content";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });
    return jsonResponse(projects);
  } catch (error) {
    console.error("[GET /api/projects] Error al leer proyectos, usando fallback:", error);
    return jsonResponse(FALLBACK_PROJECTS);
  }
}

export async function POST(req: NextRequest) {
  if (!verifyOrigin(req)) {
    return jsonResponse({ error: "Origen no autorizado." }, { status: 403 });
  }

  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { data: body, error: jsonError } = await readJsonLimited(req, 32_768);
  if (jsonError) return jsonError;

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.create({
      data: {
        ...parsed.data,
        logoUrl: parsed.data.logoUrl || null,
        coverUrl: parsed.data.coverUrl || null,
        repoUrl: parsed.data.repoUrl || null,
        liveUrl: parsed.data.liveUrl || null,
      },
    });

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("[revalidatePath] Error al invalidar caché:", e);
    }

    return jsonResponse(project, { status: 201 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return jsonResponse({ error: "Ese slug ya existe." }, { status: 409 });
    }
    console.error("[POST /api/projects] Error al crear proyecto:", error);
    return jsonResponse({ error: "No se pudo crear el proyecto." }, { status: 500 });
  }
}
