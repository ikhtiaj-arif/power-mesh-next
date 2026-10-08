import { ReservationDetail } from "@/components/modules/reservations";
import { StaticIdPage } from "@/components/shell/static-id-page";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function ConsumerReservationDetailPage() {
  return (
    <StaticIdPage>
      {(id) => (
        <ReservationDetail
          reservationId={id}
          basePath="/consumer/reservations"
        />
      )}
    </StaticIdPage>
  );
}
