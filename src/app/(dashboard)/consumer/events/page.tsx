import { Suspense } from "react";

import { AvailableEventsList } from "@/components/modules/events";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConsumerEventsPage() {
  return (
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
  );
}
