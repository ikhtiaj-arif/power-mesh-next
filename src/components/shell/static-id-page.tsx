"use client";

import { useParams, usePathname } from "next/navigation";

import { resolveStaticRouteId } from "@/lib/static-route-id";

/**
 * Client bridge for statically exported `[id]` / `[reservationId]` pages.
 * Prefer pathname over baked `params` (placeholder `_` after Vercel rewrite).
 */
export function useStaticRouteId(paramKey = "id"): string | null {
  const params = useParams();
  const pathname = usePathname();
  const raw = params?.[paramKey];
  const paramValue = Array.isArray(raw) ? raw[0] : raw;
  const id = resolveStaticRouteId(
    typeof paramValue === "string" ? paramValue : undefined,
    pathname,
  );

  // #region agent log
  fetch("http://127.0.0.1:7698/ingest/d4a25cba-e448-4169-84a8-d32878310aea", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "a75d46",
    },
    body: JSON.stringify({
      sessionId: "a75d46",
      runId: "post-rsc-fix",
      hypothesisId: "H6",
      location: "static-id-page.tsx:useStaticRouteId",
      message: "resolved static route id",
      data: { paramKey, paramValue, pathname, id },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!id || id === "_") {
    return null;
  }

  return id;
}

export function MissingStaticId() {
  return (
    <p className="text-sm text-muted-foreground">
      Missing record id in the URL.
    </p>
  );
}
