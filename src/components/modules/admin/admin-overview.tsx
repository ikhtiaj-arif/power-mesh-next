"use client";

import { useQuery } from "@tanstack/react-query";

import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import { BarChart } from "@/components/modules/dashboard/bar-chart";
import { LineChart } from "@/components/modules/dashboard/line-chart";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { OverviewTable } from "@/components/modules/dashboard/overview-table";
import { ProgressList } from "@/components/modules/dashboard/progress-list";
import { StatCard } from "@/components/modules/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardStats = {
  users: { total: number; active: number; blocked: number };
  providers: { total: number; approved: number; pending: number };
  consumers: { total: number };
  events: { total: number; active: number };
  capacity: { offers: number; requests: number; pendingRequests: number };
  reservations: { total: number; completed: number; failed: number };
  payments: { total: number; completed: number; revenue: number };
  incidents: { open: number };
  refunds: { totalAmount: number };
};

function formatMoney(value: number) {
  return `৳${value.toLocaleString()}`;
}

export function AdminOverview() {
  const stats = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () =>
      apiClient<ApiResponse<DashboardStats>>("/admin/dashboard-stats", {
        method: "GET",
      }),
    retry: false,
  });

  const data = stats.data?.data;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Admin overview"
        description="Platform users, marketplace volume, and settlement health."
      />
      {stats.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Active users"
            value={String(data?.users.active ?? 0)}
            description={`${data?.users.total ?? 0} total · ${data?.users.blocked ?? 0} blocked`}
          />
          <StatCard
            title="Providers"
            value={String(data?.providers.approved ?? 0)}
            description={`${data?.providers.pending ?? 0} pending approval`}
          />
          <StatCard
            title="Active events"
            value={String(data?.events.active ?? 0)}
            description={`${data?.events.total ?? 0} events overall`}
          />
          <StatCard
            title="Completed revenue"
            value={formatMoney(data?.payments.revenue ?? 0)}
            description={`${data?.payments.completed ?? 0} completed payments`}
          />
        </div>
      )}
      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart
          title="Marketplace pipeline"
          subtitle="Offers and requests currently on the platform"
          primaryLabel="Offers"
          secondaryLabel="Requests"
          series={[
            {
              label: "Now",
              primary: data?.capacity.offers ?? 12,
              secondary: data?.capacity.requests ?? 18,
            },
            {
              label: "Pending",
              primary: data?.providers.pending ?? 4,
              secondary: data?.capacity.pendingRequests ?? 7,
            },
            {
              label: "Done",
              primary: data?.reservations.completed ?? 9,
              secondary: data?.payments.completed ?? 8,
            },
            {
              label: "Failed",
              primary: data?.reservations.failed ?? 2,
              secondary: data?.incidents.open ?? 1,
            },
          ]}
        />
        <LineChart
          title="Settlement trend"
          subtitle="Illustrative weekly completed payments"
          labels={["W1", "W2", "W3", "W4", "W5", "W6"]}
          current={[4, 6, 5, 9, 8, 11]}
          previous={[3, 4, 5, 6, 7, 8]}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <OverviewTable
          title="Platform snapshot"
          subtitle="Counts from dashboard-stats"
          columns={["Area", "Metric", "Status", "Value"]}
          rows={[
            {
              id: "1",
              primary: "Consumers",
              secondary: "Registered profiles",
              status: "ACTIVE",
              meta: String(data?.consumers.total ?? 0),
            },
            {
              id: "2",
              primary: "Reservations",
              secondary: "All bookings",
              status: "TRACKED",
              meta: String(data?.reservations.total ?? 0),
            },
            {
              id: "3",
              primary: "Refunds",
              secondary: "Recorded amount",
              status: "LOCAL",
              meta: formatMoney(data?.refunds.totalAmount ?? 0),
            },
          ]}
        />
        <ProgressList
          title="Control plane"
          subtitle="Operational completeness"
          items={[
            {
              label: "Approved providers",
              value:
                data && data.providers.total
                  ? Math.round((data.providers.approved / data.providers.total) * 100)
                  : 0,
            },
            {
              label: "Completed reservations",
              value:
                data && data.reservations.total
                  ? Math.round(
                      (data.reservations.completed / data.reservations.total) * 100,
                    )
                  : 0,
            },
            {
              label: "Completed payments",
              value:
                data && data.payments.total
                  ? Math.round((data.payments.completed / data.payments.total) * 100)
                  : 0,
            },
          ]}
        />
      </div>
      {stats.isError ? (
        <p className="text-sm text-muted-foreground">
          Live admin stats are unavailable right now. The layout still mirrors
          the dashboard shell so you can continue building screens.
        </p>
      ) : null}
    </div>
  );
}
