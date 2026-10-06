import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { AvailableEventsList } from "@/components/modules/events";
import { Skeleton } from "@/components/ui/skeleton";
import { availableEventsKey } from "@/hooks/event.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import {
  EVENTS_REVALIDATE_SECONDS,
  getAvailableEventsISR,
} from "@/lib/isr/events";

export const revalidate = EVENTS_REVALIDATE_SECONDS;

const defaultParams = {
  page: 1,
  limit: 10,
  sortBy: "scheduledStart",
  sortOrder: "asc",
} as const;

export default async function ConsumerEventsPage() {
  const data = await getAvailableEventsISR(defaultParams);

  return (
    <HydrationBoundary
      state={dehydratePrefetchedQuery(availableEventsKey(defaultParams), data)}
    >
      <Suspense
        fallback={
          <div className="space-y-3 p-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        <AvailableEventsList basePath="/consumer/events" />
      </Suspense>
    </HydrationBoundary>
  );
}
