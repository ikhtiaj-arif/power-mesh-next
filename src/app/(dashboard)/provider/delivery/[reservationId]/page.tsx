import { DeliveryDetail } from "@/components/modules/delivery";

export const dynamic = "force-dynamic";

export default async function ProviderDeliveryDetailPage({
  params,
}: {
  params: Promise<{ reservationId: string }>;
}) {
  const { reservationId } = await params;
  return (
    <DeliveryDetail
      reservationId={reservationId}
      role="provider"
      backHref="/provider/delivery"
    />
  );
}
