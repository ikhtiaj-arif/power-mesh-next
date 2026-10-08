import { cn } from "@/lib/utils";
import type { ReservationStatus } from "@/types";

const STEPS = [
  { key: "ALLOCATED", label: "Allocated" },
  { key: "PAID", label: "Paid" },
  { key: "ON_SITE", label: "On site" },
  { key: "CONFIRMED", label: "Confirmed" },
] as const;

function stepIndex(status: ReservationStatus) {
  switch (status) {
    case "ALLOCATED":
    case "PAYMENT_PENDING":
      return 0;
    case "PAYMENT_COMPLETED":
      return 1;
    case "DELIVERY_PENDING":
    case "DELIVERY_PARTIAL":
      return 2;
    case "DELIVERY_CONFIRMED":
      return 3;
    default:
      return -1;
  }
}

export function ReservationStatusStepper({
  status,
}: {
  status: ReservationStatus;
}) {
  const active = stepIndex(status);
  if (active < 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Status: <span className="font-medium text-foreground">{status}</span>
      </p>
    );
  }

  return (
    <ol className="grid grid-cols-4 gap-1">
      {STEPS.map((step, index) => (
        <li
          key={step.key}
          className={cn(
            "rounded-md border px-2 py-1.5 text-center text-[11px] sm:text-xs",
            index <= active
              ? "border-primary/30 bg-primary/5 font-medium"
              : "text-muted-foreground",
          )}
        >
          {step.label}
        </li>
      ))}
    </ol>
  );
}
