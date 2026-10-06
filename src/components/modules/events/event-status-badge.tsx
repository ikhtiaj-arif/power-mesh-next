import { Badge } from "@/components/ui/badge";
import type { OutageEventStatus } from "@/types";

const statusVariant: Record<
  OutageEventStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  SCHEDULED: "outline",
  CONFIRMED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export function EventStatusBadge({ status }: { status: OutageEventStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
