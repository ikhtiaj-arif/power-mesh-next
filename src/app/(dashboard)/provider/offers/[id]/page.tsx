import { UpdateOfferForm } from "@/components/modules/offers";
import { StaticIdPage } from "@/components/shell/static-id-page";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function ProviderOfferDetailPage() {
  return (
    <StaticIdPage>
      {(id) => <UpdateOfferForm offerId={id} basePath="/provider/offers" />}
    </StaticIdPage>
  );
}
