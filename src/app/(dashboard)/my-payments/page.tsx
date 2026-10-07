import { Suspense } from "react";

import { MyPaymentsReturn } from "@/components/modules/payments";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyPaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3 p-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      }
    >
      <MyPaymentsReturn />
    </Suspense>
  );
}
