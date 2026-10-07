import { DeliveryDetail } from "@/components/modules/delivery";

// Static export: no IDs are known at build time.
export function generateStaticParams() {
  return [{ reservationId: "_" }];
}

export default async function ConsumerDeliveryDetailPage({
  params,
}: {
  params: Promise<{ reservationId: string }>;
}) {
  const { reservationId } = await params;
  return (
    <DeliveryDetail
      reservationId={reservationId}
      role="consumer"
      backHref={`/consumer/reservations/${reservationId}`}
    />
  );
}
