import { Badge } from "@/components/ui/badge";
import type { ReservationStatus } from "@/types";

const statusVariant: Record<
  ReservationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ALLOCATED: "secondary",
  PAYMENT_PENDING: "outline",
  PAYMENT_COMPLETED: "default",
  DELIVERY_PENDING: "outline",
  DELIVERY_CONFIRMED: "default",
  DELIVERY_PARTIAL: "secondary",
  FAILED: "destructive",
  REFUNDED: "destructive",
  CANCELLED: "outline",
};

export function ReservationStatusBadge({
  status,
}: {
  status: ReservationStatus;
}) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
