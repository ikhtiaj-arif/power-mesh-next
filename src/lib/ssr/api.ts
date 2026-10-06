import "server-only";

import { cookies } from "next/headers";

type SsrQuery = Record<string, string | number | boolean | undefined | null>;

const ACCESS_COOKIE =
  process.env.ACCESS_TOKEN_COOKIE_NAME ?? "accessToken";

/**
 * Per-request authenticated fetch for SSR pages.
 * Calling cookies() opts the route into dynamic rendering (intentional).
 */
export async function ssrFetchJson<T>(
  path: string,
  options?: { query?: SsrQuery },
): Promise<T | null> {
  const apiUrl = (process.env.API_URL ?? "").replace(/\/$/, "");
  if (!apiUrl) {
    return null;
  }

  const jar = await cookies();
  const accessToken = jar.get(ACCESS_COOKIE)?.value;
  if (!accessToken) {
    return null;
  }

  const url = new URL(`/api/v1${path.startsWith("/") ? path : `/${path}`}`, `${apiUrl}/`);
  if (options?.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}
