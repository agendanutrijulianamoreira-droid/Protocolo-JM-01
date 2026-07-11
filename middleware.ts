import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session-edge";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await getSessionFromCookie(token);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/acesso";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/protocolo/:path*"],
};
