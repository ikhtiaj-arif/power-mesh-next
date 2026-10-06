import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { AllRequestsList } from "@/components/modules/requests/all-requests-list";
import { Skeleton } from "@/components/ui/skeleton";
import { allRequestsKey } from "@/hooks/request.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import { getAllRequestsISR } from "@/lib/isr/requests-payments";

/** Must be a numeric literal for Next.js segment config static analysis. */
export const revalidate = 60;

const defaultParams = {
  page: 1,
  limit: 10,
  status: undefined,
  priorityTier: undefined,
};

export default async function OperatorRequestsPage() {
  const data = await getAllRequestsISR(defaultParams);

  return (
    <HydrationBoundary state={dehydratePrefetchedQuery(allRequestsKey(defaultParams), data)}>
      <Suspense
        fallback={
          <div className="space-y-3 p-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        <AllRequestsList />
      </Suspense>
    </HydrationBoundary>
  );
}
