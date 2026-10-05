import { BarChart } from "@/components/modules/dashboard/bar-chart";
import { LineChart } from "@/components/modules/dashboard/line-chart";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { OverviewTable } from "@/components/modules/dashboard/overview-table";
import { ProgressList } from "@/components/modules/dashboard/progress-list";
import { StatCard } from "@/components/modules/dashboard/stat-card";

export function OperatorOverview() {
  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Operator overview"
        description="Schedule outages, approve providers, and run allocation."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active events"
          value="5"
          trend="+2"
          trendUp
          description="Scheduled or in-progress outages"
        />
        <StatCard
          title="Pending providers"
          value="7"
          trend="Needs review"
          trendUp={false}
          description="Applications waiting for approval"
        />
        <StatCard
          title="Open requests"
          value="18"
          trend="+4"
          trendUp
          description="Consumer requests still pending"
        />
        <StatCard
          title="Ready to allocate"
          value="3"
          trend="Events"
          trendUp
          description="Events with offers and requests ready"
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart
          title="Allocation pipeline"
          subtitle="Requests vs allocated capacity"
          primaryLabel="Requests"
          secondaryLabel="Allocated"
          series={[
            { label: "Jan", primary: 70, secondary: 45 },
            { label: "Feb", primary: 90, secondary: 60 },
            { label: "Mar", primary: 65, secondary: 50 },
            { label: "Apr", primary: 110, secondary: 84 },
          ]}
        />
        <LineChart
          title="Event load"
          subtitle="Capacity demand across recent events"
          labels={["E1", "E2", "E3", "E4", "E5", "E6"]}
          current={[120, 90, 150, 130, 170, 140]}
          previous={[100, 95, 110, 125, 135, 128]}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <OverviewTable
          title="Events needing action"
          subtitle="Operator-owned outage windows"
          columns={["Event", "Demand", "Status", "Start"]}
          rows={[
            {
              id: "1",
              primary: "Mirpur feeder A",
              secondary: "240 kW",
              status: "SCHEDULED",
              meta: "Oct 8, 10pm",
            },
            {
              id: "2",
              primary: "Gulshan hospital",
              secondary: "180 kW",
              status: "CONFIRMED",
              meta: "Oct 9, 1am",
            },
            {
              id: "3",
              primary: "Tejgaon industrial",
              secondary: "320 kW",
              status: "IN_PROGRESS",
              meta: "Tonight",
            },
          ]}
        />
        <ProgressList
          title="Ops checklist"
          subtitle="Current operating cycle"
          items={[
            { label: "Provider approvals", value: 55 },
            { label: "Allocation previewed", value: 40 },
            { label: "Reservations settled", value: 25 },
          ]}
        />
      </div>
    </div>
  );
}
