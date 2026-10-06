import { Badge } from "@/components/ui/badge";
import type { DeliveryStatus } from "@/types";

const LABELS: Record<DeliveryStatus, string> = {
  PENDING_CHECKIN: "Pending check-in",
  CONFIRMED: "Confirmed",
  DISPUTED: "Disputed",
  RESOLVED: "Resolved",
  PARTIAL: "Partial",
};

export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  const variant =
    status === "CONFIRMED"
      ? "default"
      : status === "DISPUTED"
        ? "destructive"
        : status === "PARTIAL"
          ? "secondary"
          : "outline";

  return <Badge variant={variant}>{LABELS[status] ?? status}</Badge>;
}
