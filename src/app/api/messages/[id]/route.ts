import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: Boolean(body.read) },
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error("[PATCH /api/messages/:id]", error);
    return NextResponse.json({ error: "No se pudo actualizar el mensaje." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/messages/:id]", error);
    return NextResponse.json({ error: "No se pudo eliminar el mensaje." }, { status: 500 });
  }
}
