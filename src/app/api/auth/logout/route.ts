import { NextRequest } from "next/server";
import { destroySession } from "@/lib/auth";
import { verifyOrigin, jsonResponse } from "@/lib/security";

export async function POST(req: NextRequest) {
  if (!verifyOrigin(req)) {
    return jsonResponse({ error: "Origen no autorizado." }, { status: 403 });
  }

  await destroySession();
  return jsonResponse({ ok: true });
}
