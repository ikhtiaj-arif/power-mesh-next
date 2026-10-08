"use client";

import { DeliveryDetail } from "@/components/modules/delivery";
import {
  MissingStaticId,
  useStaticRouteId,
} from "@/components/shell/static-id-page";

export default function ProviderDeliveryDetailClient() {
  const reservationId = useStaticRouteId("reservationId");
  if (!reservationId) return <MissingStaticId />;
  return (
    <DeliveryDetail
      reservationId={reservationId}
      role="provider"
      backHref="/provider/delivery"
    />
  );
}
