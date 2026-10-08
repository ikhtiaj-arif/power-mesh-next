import { AllocationWorkbench } from "@/components/modules/allocation";

export default function AdminAllocationPage() {
  return (
    <AllocationWorkbench
      eventSource="all"
      title="Allocation (admin)"
      description="Preview and approve allocation across all events. Event create and status changes stay with operators."
    />
  );
}
