import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "migol_session";
const AUTH_SECRET = process.env.AUTH_SECRET;

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  if (!AUTH_SECRET) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(AUTH_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // Proteger rutas admin excepto login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const isAuthed = await isAuthenticated(req);
    if (!isAuthed) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // Agregar cabeceras de seguridad adicionales
  if (pathname.startsWith("/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
