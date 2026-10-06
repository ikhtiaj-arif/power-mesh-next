import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { AdminAuditLog } from "@/components/modules/admin/admin-audit-log";
import { Skeleton } from "@/components/ui/skeleton";
import { auditLogsKey } from "@/hooks/admin.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import { getAuditLogsISR } from "@/lib/isr/admin";

/** Must be a numeric literal for Next.js segment config static analysis. */
export const revalidate = 60;

const defaultParams = {
  page: 1,
  limit: 10,
  action: undefined,
  entityType: undefined,
};

export default async function AdminAuditPage() {
  const data = await getAuditLogsISR(defaultParams);

  return (
    <HydrationBoundary state={dehydratePrefetchedQuery(auditLogsKey(defaultParams), data)}>
      <Suspense
        fallback={
          <div className="space-y-3 p-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        <AdminAuditLog />
      </Suspense>
    </HydrationBoundary>
  );
}
