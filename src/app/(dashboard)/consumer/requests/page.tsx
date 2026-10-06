import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { MyRequestsList } from "@/components/modules/requests";
import { Skeleton } from "@/components/ui/skeleton";
import { myRequestsKey } from "@/hooks/request.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getMyRequestsSSR } from "@/lib/ssr/queries";

export const dynamic = "force-dynamic";

const defaultParams = {
  page: 1,
  limit: 10,
  status: undefined,
  priorityTier: undefined,
};

export default async function ConsumerRequestsPage() {
  const queryClient = createSsrQueryClient();
  setSsrQueryData(
    queryClient,
    myRequestsKey(defaultParams),
    await getMyRequestsSSR(defaultParams),
  );

  return (
    <HydrationBoundary state={dehydrateSsrClient(queryClient)}>
      <Suspense
        fallback={
          <div className="space-y-3 p-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        <MyRequestsList basePath="/consumer/requests" />
      </Suspense>
    </HydrationBoundary>
  );
}
