import "server-only";

type IsrQuery = Record<string, string | number | boolean | undefined | null>;

/**
 * Server-only fetch for ISR / build-time shared catalogs.
 * Uses ISR_SERVICE_TOKEN so the RSC tree never calls cookies().
 * Returns null when unset or when the upstream call fails (client Query still loads).
 */
export async function isrFetchJson<T>(
  path: string,
  options?: {
    query?: IsrQuery;
    revalidate?: number | false;
    tags?: string[];
  },
): Promise<T | null> {
  const apiUrl = (process.env.API_URL ?? "").replace(/\/$/, "");
  const token = process.env.ISR_SERVICE_TOKEN;

  if (!apiUrl || !token) {
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
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      next: {
        revalidate: options?.revalidate ?? 60,
        tags: options?.tags,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}
