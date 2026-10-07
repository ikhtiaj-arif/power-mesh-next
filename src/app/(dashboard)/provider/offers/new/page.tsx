import Link from "next/link";
import { Suspense } from "react";

import { CreateOfferForm } from "@/components/modules/offers";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderCreateOfferPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="New offer"
          description="Choose an available event and publish capacity for that window."
        />
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/provider/offers" />}
        >
          Back to offers
        </Button>
      </div>
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <CreateOfferForm basePath="/provider/offers" />
      </Suspense>
    </div>
  );
}
