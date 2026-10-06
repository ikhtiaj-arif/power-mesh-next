import { HydrationBoundary } from "@tanstack/react-query";

import { ConsumerOverview } from "@/components/modules/consumer/consumer-overview";
import { availableEventsKey } from "@/hooks/event.hook";
import { myRequestsKey } from "@/hooks/request.hook";
import { myReservationsKey } from "@/hooks/reservation.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import {
  getAvailableEventsSSR,
  getMyRequestsSSR,
  getMyReservationsSSR,
} from "@/lib/ssr/queries";

/** Personalized home — must use the caller's session cookies. */
export const dynamic = "force-dynamic";

export default async function ConsumerHomePage() {
  const queryClient = createSsrQueryClient();
  const eventParams = { page: 1, limit: 5 };
  const listParams = { page: 1, limit: 5 };

  const [events, requests, reservations] = await Promise.all([
    getAvailableEventsSSR(eventParams),
    getMyRequestsSSR(listParams),
    getMyReservationsSSR(listParams),
  ]);

  setSsrQueryData(queryClient, availableEventsKey(eventParams), events);
  setSsrQueryData(queryClient, myRequestsKey(listParams), requests);
  setSsrQueryData(queryClient, myReservationsKey(listParams), reservations);

  return (
    <HydrationBoundary state={dehydrateSsrClient(queryClient)}>
      <ConsumerOverview />
    </HydrationBoundary>
  );
}
