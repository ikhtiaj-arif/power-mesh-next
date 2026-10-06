import { Suspense } from "react";

import { MyOffersList } from "@/components/modules/offers";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderOffersPage() {
  return (
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
  );
}
