import { Badge } from "@/components/ui/badge";
import type { OfferStatus } from "@/types";

const statusVariant: Record<
  OfferStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  AVAILABLE: "default",
  PARTIALLY_AVAILABLE: "secondary",
  FULLY_ALLOCATED: "outline",
  EXPIRED: "outline",
  CANCELLED: "destructive",
};

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
