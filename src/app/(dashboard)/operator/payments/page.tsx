import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { OperatorPaymentsList } from "@/components/modules/payments/operator-payments-list";
import { Skeleton } from "@/components/ui/skeleton";
import { allPaymentsKey } from "@/hooks/payment.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import {
  getAllPaymentsISR,
  OPS_LIST_REVALIDATE_SECONDS,
} from "@/lib/isr/requests-payments";

export const revalidate = OPS_LIST_REVALIDATE_SECONDS;

const defaultParams = {
  page: 1,
  limit: 10,
  gatewayStatus: undefined,
};

export default async function OperatorPaymentsPage() {
  const data = await getAllPaymentsISR(defaultParams);

  return (
    <HydrationBoundary state={dehydratePrefetchedQuery(allPaymentsKey(defaultParams), data)}>
      <Suspense
        fallback={
          <div className="space-y-3 p-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        <OperatorPaymentsList />
      </Suspense>
    </HydrationBoundary>
  );
}
