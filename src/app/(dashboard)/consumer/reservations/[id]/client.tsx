"use client";

import { ReservationDetail } from "@/components/modules/reservations";
import {
  MissingStaticId,
  useStaticRouteId,
} from "@/components/shell/static-id-page";

export default function ConsumerReservationDetailClient() {
  const id = useStaticRouteId();
  if (!id) return <MissingStaticId />;
  return (
    <ReservationDetail reservationId={id} basePath="/consumer/reservations" />
  );
}
