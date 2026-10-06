import { UpdateOfferForm } from "@/components/modules/offers";

export default async function ProviderOfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UpdateOfferForm offerId={id} basePath="/provider/offers" />;
}
