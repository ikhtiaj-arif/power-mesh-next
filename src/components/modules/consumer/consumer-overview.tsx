import { BarChart } from "@/components/modules/dashboard/bar-chart";
import { LineChart } from "@/components/modules/dashboard/line-chart";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { OverviewTable } from "@/components/modules/dashboard/overview-table";
import { ProgressList } from "@/components/modules/dashboard/progress-list";
import { StatCard } from "@/components/modules/dashboard/stat-card";

export function ConsumerOverview() {
  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Consumer overview"
        description="Track backup requests, reservations, and payment progress."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Open requests"
          value="4"
          trend="+1 this week"
          trendUp
          description="Capacity requests awaiting allocation"
        />
        <StatCard
          title="Active reservations"
          value="2"
          trend="Stable"
          trendUp
          description="Reserved kilowatts for upcoming outages"
        />
        <StatCard
          title="Payments due"
          value="৳12,400"
          trend="-8%"
          trendUp={false}
          description="Pending bKash checkouts"
        />
        <StatCard
          title="Delivered kW"
          value="180"
          trend="+24 kW"
          trendUp
          description="Confirmed deliveries this month"
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart
          title="Request pipeline"
          subtitle="Requests vs fulfilled capacity by week"
          primaryLabel="Requested"
          secondaryLabel="Fulfilled"
          series={[
            { label: "W1", primary: 40, secondary: 28 },
            { label: "W2", primary: 55, secondary: 42 },
            { label: "W3", primary: 36, secondary: 30 },
            { label: "W4", primary: 62, secondary: 48 },
          ]}
        />
        <LineChart
          title="Spend flow"
          subtitle="Current month vs previous month"
          labels={["Week 1", "Week 2", "Week 3", "Week 4"]}
          current={[8, 12, 10, 16]}
          previous={[6, 9, 11, 13]}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <OverviewTable
          title="Recent reservations"
          subtitle="Latest consumer bookings"
          columns={["Event", "Capacity", "Status", "Amount"]}
          rows={[
            {
              id: "1",
              primary: "Mirpur feeder outage",
              secondary: "40 kW",
              status: "PAYMENT_PENDING",
              meta: "৳4,800",
            },
            {
              id: "2",
              primary: "Gulshan hospital window",
              secondary: "60 kW",
              status: "PAYMENT_COMPLETED",
              meta: "৳7,200",
            },
            {
              id: "3",
              primary: "Banani night cut",
              secondary: "25 kW",
              status: "DELIVERY_PENDING",
              meta: "৳3,000",
            },
          ]}
        />
        <ProgressList
          title="Fulfillment"
          subtitle="Delivery stages for active bookings"
          items={[
            { label: "Payment completed", value: 75, hint: "3 of 4" },
            { label: "Provider check-in", value: 50, hint: "2 of 4" },
            { label: "Delivery confirmed", value: 25, hint: "1 of 4" },
          ]}
        />
      </div>
    </div>
  );
}
