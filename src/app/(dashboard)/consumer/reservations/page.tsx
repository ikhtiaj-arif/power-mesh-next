import { Suspense } from "react";

import { MyReservationsList } from "@/components/modules/reservations";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConsumerReservationsPage() {
  return (
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
  );
}
