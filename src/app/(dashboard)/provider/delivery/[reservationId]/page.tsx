import { DeliveryDetail } from "@/components/modules/delivery";

// Static export: no IDs are known at build time; the client-side router loads
// the correct data after hydration using the URL param.
export function generateStaticParams() {
  return [{ reservationId: "_" }];
}

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
