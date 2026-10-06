import { HydrationBoundary } from "@tanstack/react-query";

import { ProviderReservationsList } from "@/components/modules/reservations";
import { USER_QUERY_KEY } from "@/hooks/auth.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getMeSSR } from "@/lib/ssr/queries";

export const dynamic = "force-dynamic";

export default async function ProviderReservationsPage() {
  const queryClient = createSsrQueryClient();
  setSsrQueryData(queryClient, USER_QUERY_KEY, await getMeSSR());

  return (
    <HydrationBoundary state={dehydrateSsrClient(queryClient)}>
      <ProviderReservationsList />
    </HydrationBoundary>
  );
}
