import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { skillSchema } from "@/lib/validations";

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: [{ order: "asc" }] });
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const skill = await prisma.skill.create({ data: parsed.data });
    return NextResponse.json(skill, { status: 201 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Esa habilidad ya existe." }, { status: 409 });
    }
    console.error("[POST /api/skills]", error);
    return NextResponse.json({ error: "No se pudo crear la habilidad." }, { status: 500 });
  }
}
