import { DeliveryDetail } from "@/components/modules/delivery";
import { StaticIdPage } from "@/components/shell/static-id-page";

export function generateStaticParams() {
  return [{ reservationId: "_" }];
}

export default function ConsumerDeliveryDetailPage() {
  return (
    <StaticIdPage paramKey="reservationId">
      {(reservationId) => (
        <DeliveryDetail
          reservationId={reservationId}
          role="consumer"
          backHref={`/consumer/reservations/${reservationId}`}
        />
      )}
    </StaticIdPage>
  );
}
