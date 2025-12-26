import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ROUTER_PATH } from "./constants/router-path";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL(ROUTER_PATH.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/v1/* (API routes)
     * - /_next/static/* (static files)
     * - /_next/image/* (image optimization)
     * - /login and /register (auth pages)
     * - Static asset files (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
     */
    "/((?!api|_next/static|_next/image|login|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|$).*)",
  ],
};
