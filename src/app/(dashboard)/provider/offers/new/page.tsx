import Link from "next/link";

import { CreateOfferForm } from "@/components/modules/offers";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { Button } from "@/components/ui/button";

export default function ProviderCreateOfferPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="New offer"
          description="Publish capacity for an available outage event."
        />
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/provider/offers" />}
        >
          Back to offers
        </Button>
      </div>
      <CreateOfferForm basePath="/provider/offers" />
    </div>
  );
}
