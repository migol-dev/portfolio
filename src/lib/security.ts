import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export function jsonResponse(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }
  return NextResponse.json(data, {
    ...init,
    headers,
  });
}

export function verifyOrigin(req: Request | NextRequest): boolean {
  if (req.method === "GET" || req.method === "HEAD") {
    return true;
  }

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host") || req.headers.get("x-forwarded-host");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!origin && !referer) {
    // En desarrollo permitimos si no hay cabecera de origen (e.g. curl/Postman sin origin)
    return process.env.NODE_ENV !== "production";
  }

  const checkUrl = (urlStr: string) => {
    try {
      const parsed = new URL(urlStr);
      if (host && (parsed.host === host || parsed.host.split(":")[0] === host.split(":")[0])) {
        return true;
      }
      if (siteUrl) {
        const siteParsed = new URL(siteUrl);
        if (parsed.host === siteParsed.host) return true;
      }
      if (process.env.NODE_ENV !== "production") {
        if (
          parsed.hostname === "localhost" ||
          parsed.hostname === "127.0.0.1" ||
          parsed.hostname.startsWith("192.168.")
        ) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  if (origin && !checkUrl(origin)) return false;
  if (!origin && referer && !checkUrl(referer)) return false;

  return true;
}

export async function readJsonLimited<T = unknown>(
  req: Request | NextRequest,
  maxBytes = 32_768
): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return {
      error: jsonResponse(
        { error: "Payload demasiado grande." },
        { status: 413 }
      ),
    };
  }

  try {
    const text = await req.text();
    if (new TextEncoder().encode(text).length > maxBytes) {
      return {
        error: jsonResponse(
          { error: "Payload demasiado grande." },
          { status: 413 }
        ),
      };
    }
    const data = (text ? JSON.parse(text) : {}) as T;
    return { data };
  } catch {
    return {
      error: jsonResponse({ error: "JSON inválido." }, { status: 400 }),
    };
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      errorResponse: jsonResponse({ error: "No autorizado." }, { status: 401 }),
    };
  }
  return { session, errorResponse: null };
}
