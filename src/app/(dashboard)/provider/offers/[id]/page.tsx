import { UpdateOfferForm } from "@/components/modules/offers";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default async function ProviderOfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UpdateOfferForm offerId={id} basePath="/provider/offers" />;
}
