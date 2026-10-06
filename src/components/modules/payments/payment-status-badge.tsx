import { Badge } from "@/components/ui/badge";
import type { GatewayPaymentStatus } from "@/types";

const LABELS: Record<GatewayPaymentStatus, string> = {
  INITIATED: "Initiated",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export function PaymentStatusBadge({
  status,
}: {
  status: GatewayPaymentStatus;
}) {
  const variant =
    status === "COMPLETED"
      ? "default"
      : status === "FAILED"
        ? "destructive"
        : "secondary";

  return <Badge variant={variant}>{LABELS[status] ?? status}</Badge>;
}
