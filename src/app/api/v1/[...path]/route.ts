import { NextRequest, NextResponse } from "next/server";

const API_URL = (process.env.API_URL ?? "http://localhost:5000").replace(/\/$/, "");

/**
 * Upstream auth cookies use SameSite=None without Secure. Browsers reject that
 * on http://localhost, so Postman works and Chrome does not. Rewrite every
 * Set-Cookie to a first-party Lax cookie for the Next origin.
 */
function rewriteSetCookie(header: string) {
  const parts = header
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => {
      const lower = part.toLowerCase();
      return (
        lower !== "secure" &&
        !lower.startsWith("samesite=") &&
        !lower.startsWith("path=")
      );
    });

  parts.push("Path=/", "SameSite=Lax");

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function buildUpstreamHeaders(request: NextRequest) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");

  if (contentType) {
    headers.set("content-type", contentType);
  }
  if (cookie) {
    headers.set("cookie", cookie);
  }
  if (authorization) {
    headers.set("authorization", authorization);
  }

  return headers;
}

function collectSetCookies(headers: Headers) {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const single = headers.get("set-cookie");
  return single ? [single] : [];
}

async function proxy(request: NextRequest, path: string[]) {
  try {
    const search = request.nextUrl.search;
    const upstreamUrl = `${API_URL}/api/v1/${path.join("/")}${search}`;
    const method = request.method.toUpperCase();
    const headers = buildUpstreamHeaders(request);
    const body =
      method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

    const upstream = await fetch(upstreamUrl, {
      method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    const contentType = upstream.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("content-type", contentType);
    }

    for (const cookie of collectSetCookies(upstream.headers)) {
      responseHeaders.append("set-cookie", rewriteSetCookie(cookie));
    }

    const responseBody = await upstream.arrayBuffer();

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy request failed";
    return NextResponse.json(
      {
        success: false,
        message: `API proxy error: ${message}`,
        errors: [message],
        apiUrl: API_URL,
      },
      { status: 502 },
    );
  }
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}
