import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { MyOffersList } from "@/components/modules/offers";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_QUERY_KEY } from "@/hooks/auth.hook";
import { myOffersKey } from "@/hooks/offer.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getMeSSR, getMyOffersSSR } from "@/lib/ssr/queries";

export const dynamic = "force-dynamic";

const defaultParams = { page: 1, limit: 10, status: undefined };

export default async function ProviderOffersPage() {
  const queryClient = createSsrQueryClient();
  const [me, offers] = await Promise.all([
    getMeSSR(),
    getMyOffersSSR(defaultParams),
  ]);
  setSsrQueryData(queryClient, USER_QUERY_KEY, me);
  setSsrQueryData(queryClient, myOffersKey(defaultParams), offers);

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
        <MyOffersList basePath="/provider/offers" />
      </Suspense>
    </HydrationBoundary>
  );
}
