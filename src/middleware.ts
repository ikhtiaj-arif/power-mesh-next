import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE =
  process.env.ACCESS_TOKEN_COOKIE_NAME ?? "accessToken";
const REFRESH_COOKIE =
  process.env.REFRESH_TOKEN_COOKIE_NAME ?? "refreshToken";

const PROTECTED_PREFIXES = [
  "/consumer",
  "/provider",
  "/operator",
  "/admin",
  "/my-payments",
] as const;

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const hasSession =
    Boolean(request.cookies.get(ACCESS_COOKIE)?.value) ||
    Boolean(request.cookies.get(REFRESH_COOKIE)?.value);

  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/consumer/:path*",
    "/provider/:path*",
    "/operator/:path*",
    "/admin/:path*",
    "/my-payments",
    "/my-payments/:path*",
  ],
};
