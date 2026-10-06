import { HydrationBoundary } from "@tanstack/react-query";

import { AdminEventsList } from "@/components/modules/events";
import { allEventsKey } from "@/hooks/event.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import {
  EVENTS_REVALIDATE_SECONDS,
  getAllEventsISR,
} from "@/lib/isr/events";

export const revalidate = EVENTS_REVALIDATE_SECONDS;

/** Must match AdminEventsList initial params (includes status: undefined). */
const defaultParams = { page: 1, limit: 10, status: undefined };

export default async function AdminEventsPage() {
  const data = await getAllEventsISR(defaultParams);

  return (
    <HydrationBoundary state={dehydratePrefetchedQuery(allEventsKey(defaultParams), data)}>
      <AdminEventsList basePath="/admin/events" />
    </HydrationBoundary>
  );
}
