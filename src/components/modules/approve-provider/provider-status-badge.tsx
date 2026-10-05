import { Badge } from "@/components/ui/badge";
import type { ProviderStatus } from "@/types";

const statusVariant: Record<
  ProviderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING_EMAIL_VERIFICATION: "outline",
  PENDING_APPROVAL: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

const statusLabel: Record<ProviderStatus, string> = {
  PENDING_EMAIL_VERIFICATION: "PENDING_EMAIL_VERIFICATION",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export function ProviderStatusBadge({ status }: { status: ProviderStatus }) {
  return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>;
}
