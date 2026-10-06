import { AllocationWorkbench } from "@/components/modules/allocation";

/** Allocation is high-churn and operator-scoped — always render per request. */
export const dynamic = "force-dynamic";

export default function OperatorAllocationPage() {
  return <AllocationWorkbench eventSource="my" />;
}
