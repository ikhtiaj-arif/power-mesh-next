import { BarChart } from "@/components/modules/dashboard/bar-chart";
import { LineChart } from "@/components/modules/dashboard/line-chart";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { OverviewTable } from "@/components/modules/dashboard/overview-table";
import { ProgressList } from "@/components/modules/dashboard/progress-list";
import { StatCard } from "@/components/modules/dashboard/stat-card";

export function ProviderOverview() {
  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Provider overview"
        description="Monitor offers, allocations, and delivery check-ins."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Live offers"
          value="3"
          trend="+1"
          trendUp
          description="Published capacity for open events"
        />
        <StatCard
          title="Allocated kW"
          value="220"
          trend="+18%"
          trendUp
          description="Reserved against your offers"
        />
        <StatCard
          title="Pending delivery"
          value="2"
          trend="Needs check-in"
          trendUp={false}
          description="Reservations awaiting provider action"
        />
        <StatCard
          title="Approval status"
          value="Pending"
          description="Offers require an approved provider profile"
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart
          title="Offer pipeline"
          subtitle="Offered vs allocated kilowatts"
          primaryLabel="Offered"
          secondaryLabel="Allocated"
          series={[
            { label: "Q1", primary: 120, secondary: 80 },
            { label: "Q2", primary: 150, secondary: 110 },
            { label: "Q3", primary: 90, secondary: 70 },
            { label: "Q4", primary: 180, secondary: 140 },
          ]}
        />
        <LineChart
          title="Utilization"
          subtitle="Allocated capacity over recent weeks"
          labels={["W1", "W2", "W3", "W4", "W5", "W6"]}
          current={[40, 55, 48, 70, 66, 82]}
          previous={[30, 42, 50, 58, 60, 68]}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <OverviewTable
          title="Upcoming deliveries"
          subtitle="Reservations that need check-in or kW report"
          columns={["Event", "kW", "Status", "Window"]}
          rows={[
            {
              id: "1",
              primary: "Uttara industrial cut",
              secondary: "80 kW",
              status: "DELIVERY_PENDING",
              meta: "Tonight 10pm",
            },
            {
              id: "2",
              primary: "Motijheel feeder",
              secondary: "45 kW",
              status: "PAYMENT_COMPLETED",
              meta: "Tomorrow 1pm",
            },
            {
              id: "3",
              primary: "Dhanmondi backup",
              secondary: "30 kW",
              status: "ALLOCATED",
              meta: "Fri 8pm",
            },
          ]}
        />
        <ProgressList
          title="Delivery readiness"
          subtitle="Progress across open reservations"
          items={[
            { label: "Payment received", value: 80 },
            { label: "Check-in complete", value: 40 },
            { label: "kW reported", value: 20 },
          ]}
        />
      </div>
    </div>
  );
}
