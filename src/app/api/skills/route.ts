import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";
import { verifyOrigin, readJsonLimited, jsonResponse, requireAdmin } from "@/lib/security";
import { FALLBACK_SKILLS } from "@/lib/fallback-content";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({ orderBy: [{ order: "asc" }] });
    return jsonResponse(skills);
  } catch (error) {
    console.error("[GET /api/skills] Error al leer habilidades, usando fallback:", error);
    return jsonResponse(FALLBACK_SKILLS);
  }
}

export async function POST(req: NextRequest) {
  if (!verifyOrigin(req)) {
    return jsonResponse({ error: "Origen no autorizado." }, { status: 403 });
  }

  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { data: body, error: jsonError } = await readJsonLimited(req, 16_384);
  if (jsonError) return jsonError;

  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const skill = await prisma.skill.create({ data: parsed.data });

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("[revalidatePath] Error al invalidar caché:", e);
    }

    return jsonResponse(skill, { status: 201 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return jsonResponse({ error: "Esa habilidad ya existe." }, { status: 409 });
    }
    console.error("[POST /api/skills] Error al crear habilidad:", error);
    return jsonResponse({ error: "No se pudo crear la habilidad." }, { status: 500 });
  }
}
