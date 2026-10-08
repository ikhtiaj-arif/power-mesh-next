"use client";

import Link from "next/link";

import { BarChart } from "@/components/modules/dashboard/bar-chart";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { OverviewTable } from "@/components/modules/dashboard/overview-table";
import { ProgressList } from "@/components/modules/dashboard/progress-list";
import { StatCard } from "@/components/modules/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardStats } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";

function formatMoney(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return `৳${Number.isFinite(n) ? n.toLocaleString() : "0"}`;
}

export function AdminOverview() {
  const stats = useGetDashboardStats();
  const data = stats.data;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Home"
        description="Platform users, marketplace volume, and settlement health."
        actions={
          <Button size="sm" variant="outline" render={<Link href="/admin/audit" />}>
            Audit log
          </Button>
        }
      />

      {!stats.isPending && data ? (
        <Card>
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
            <CardDescription>
              Jump to moderation and provider review when counts rise.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              render={<Link href="/admin/users?status=BLOCKED" />}
            >
              Blocked users ({data.users.blocked})
            </Button>
            <Button
              size="sm"
              variant="outline"
              render={<Link href="/admin/providers" />}
            >
              Pending providers ({data.providers.pending})
            </Button>
            <Button
              size="sm"
              variant="outline"
              render={<Link href="/admin/allocation" />}
            >
              Allocation
            </Button>
          </CardContent>
        </Card>
      ) : null}

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

      {!stats.isPending && data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Open incidents"
            value={String(data.incidents.open)}
            description="Aggregate open count (no incident inbox)"
          />
          <StatCard
            title="Refund total"
            value={formatMoney(data.refunds.totalAmount)}
            description="Recorded refund amounts (local ledger)"
          />
          <StatCard
            title="Pending requests"
            value={String(data.capacity.pendingRequests)}
            description={`${data.capacity.requests} requests total`}
          />
          <StatCard
            title="Reservations"
            value={String(data.reservations.total)}
            description={`${data.reservations.completed} delivery confirmed · ${data.reservations.failed} failed/cancelled/refunded`}
          />
        </div>
      ) : null}

      {stats.isPending ? null : data ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <BarChart
            title="Marketplace pipeline"
            subtitle="Live counts from dashboard-stats"
            primaryLabel="Offers"
            secondaryLabel="Requests"
            series={[
              {
                label: "Listed",
                primary: data.capacity.offers,
                secondary: data.capacity.requests,
              },
              {
                label: "Pending",
                primary: data.providers.pending,
                secondary: data.capacity.pendingRequests,
              },
              {
                label: "Done",
                primary: data.reservations.completed,
                secondary: data.payments.completed,
              },
              {
                label: "Failed",
                primary: data.reservations.failed,
                secondary: data.incidents.open,
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
                  data.providers.total > 0
                    ? Math.round((data.providers.approved / data.providers.total) * 100)
                    : 0,
              },
              {
                label: "Completed reservations",
                value:
                  data.reservations.total > 0
                    ? Math.round(
                        (data.reservations.completed / data.reservations.total) * 100,
                      )
                    : 0,
              },
              {
                label: "Completed payments",
                value:
                  data.payments.total > 0
                    ? Math.round((data.payments.completed / data.payments.total) * 100)
                    : 0,
              },
            ]}
          />
        </div>
      ) : null}

      {!stats.isPending && data ? (
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
              meta: String(data.consumers.total),
            },
            {
              id: "2",
              primary: "Offers",
              secondary: "Capacity listings",
              status: "TRACKED",
              meta: String(data.capacity.offers),
            },
            {
              id: "3",
              primary: "Payments",
              secondary: "All gateway rows",
              status: "TRACKED",
              meta: String(data.payments.total),
            },
          ]}
        />
      ) : null}

      {stats.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(stats.error, "Live admin stats are unavailable right now.")}
        </p>
      ) : null}
    </div>
  );
}
