import { ReservationDetail } from "@/components/modules/reservations";

export default async function ConsumerReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ReservationDetail
      reservationId={id}
      basePath="/consumer/reservations"
    />
  );
}
