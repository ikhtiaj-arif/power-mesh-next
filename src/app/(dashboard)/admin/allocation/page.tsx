import { AllocationWorkbench } from "@/components/modules/allocation";

export const dynamic = "force-dynamic";

export default function AdminAllocationPage() {
  return (
    <AllocationWorkbench
      eventSource="all"
      title="Allocation (admin)"
      description="Read-only event selection from GET /event/all. Preview and approve allocation without event create or status writes."
    />
  );
}
