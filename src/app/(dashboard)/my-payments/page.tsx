import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { MyPaymentsReturn } from "@/components/modules/payments";
import { Skeleton } from "@/components/ui/skeleton";
import { myPaymentsKey } from "@/hooks/payment.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getMyPaymentsSSR } from "@/lib/ssr/queries";

/** Payment return must reflect this session's latest gateway state. */
export const dynamic = "force-dynamic";

const paymentParams = {
  page: 1,
  limit: 20,
  sortBy: "updatedAt",
  sortOrder: "desc",
} as const;

export default async function MyPaymentsPage() {
  const queryClient = createSsrQueryClient();
  setSsrQueryData(
    queryClient,
    myPaymentsKey(paymentParams),
    await getMyPaymentsSSR(paymentParams),
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
        <MyPaymentsReturn />
      </Suspense>
    </HydrationBoundary>
  );
}
