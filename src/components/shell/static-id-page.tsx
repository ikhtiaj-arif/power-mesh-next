"use client";

import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { resolveStaticRouteId } from "@/lib/static-route-id";

/**
 * Client bridge for statically exported `[id]` / `[reservationId]` pages.
 */
export function StaticIdPage({
  paramKey = "id",
  children,
}: {
  paramKey?: string;
  children: (id: string) => ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const raw = params?.[paramKey];
  const paramValue = Array.isArray(raw) ? raw[0] : raw;
  const id = resolveStaticRouteId(
    typeof paramValue === "string" ? paramValue : undefined,
    pathname,
  );

  if (!id || id === "_") {
    return (
      <p className="text-sm text-muted-foreground">
        Missing record id in the URL.
      </p>
    );
  }

  return <>{children(id)}</>;
}
