import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { MyReservationsList } from "@/components/modules/reservations";
import { Skeleton } from "@/components/ui/skeleton";
import { myReservationsKey } from "@/hooks/reservation.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getMyReservationsSSR } from "@/lib/ssr/queries";

export const dynamic = "force-dynamic";

const defaultParams = { page: 1, limit: 10, status: undefined };

export default async function ConsumerReservationsPage() {
  const queryClient = createSsrQueryClient();
  setSsrQueryData(
    queryClient,
    myReservationsKey(defaultParams),
    await getMyReservationsSSR(defaultParams),
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
        <MyReservationsList basePath="/consumer/reservations" />
      </Suspense>
    </HydrationBoundary>
  );
}
