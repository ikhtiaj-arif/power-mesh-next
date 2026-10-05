import { Suspense } from "react";

import { MyRequestsList } from "@/components/modules/requests";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConsumerRequestsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3 p-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      }
    >
      <MyRequestsList basePath="/consumer/requests" />
    </Suspense>
  );
}
