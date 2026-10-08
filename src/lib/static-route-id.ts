/**
 * Static export only prerenders placeholder routes like `/admin/users/_`.
 * Vercel rewrites real UUIDs to that HTML file, but baked `params.id` stays `_`.
 * Prefer the live pathname segment so client data hooks fetch the right record.
 */
export function resolveStaticRouteId(
  paramsId: string | undefined,
  pathname: string,
): string {
  const segments = pathname.split("/").filter(Boolean);
  const fromPath = segments[segments.length - 1] ?? "";
  if (fromPath && fromPath !== "_") {
    return fromPath;
  }
  if (paramsId && paramsId !== "_") {
    return paramsId;
  }
  return paramsId ?? fromPath;
}
