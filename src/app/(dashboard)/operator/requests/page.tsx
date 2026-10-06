import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { AllRequestsList } from "@/components/modules/requests/all-requests-list";
import { Skeleton } from "@/components/ui/skeleton";
import { allRequestsKey } from "@/hooks/request.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import {
  getAllRequestsISR,
  OPS_LIST_REVALIDATE_SECONDS,
} from "@/lib/isr/requests-payments";

export const revalidate = OPS_LIST_REVALIDATE_SECONDS;

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
