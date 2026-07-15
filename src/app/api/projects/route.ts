import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { projectSchema } from "@/lib/validations";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  return NextResponse.json(projects);
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

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
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
    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Ese slug ya existe." }, { status: 409 });
    }
    console.error("[POST /api/projects]", error);
    return NextResponse.json({ error: "No se pudo crear el proyecto." }, { status: 500 });
  }
}
