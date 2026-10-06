import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/types";

const statusVariant: Record<
  RequestStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  ALLOCATED: "default",
  FULFILLED: "default",
  REJECTED: "destructive",
  CANCELLED: "outline",
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
