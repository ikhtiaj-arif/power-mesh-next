"use client";

import Link from "next/link";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { OverviewTable } from "@/components/modules/dashboard/overview-table";
import { ReservationStatusBadge } from "@/components/modules/reservations/reservation-status-badge";
import { RequestStatusBadge } from "@/components/modules/requests/request-status-badge";
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
import {
  useGetAvailableEvents,
  useGetMyRequests,
  useGetMyReservations,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";

function formatMoney(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return `৳${Number.isFinite(n) ? n.toLocaleString() : "0"}`;
}

export function ConsumerOverview() {
  const events = useGetAvailableEvents({ page: 1, limit: 5 });
  const requests = useGetMyRequests({ page: 1, limit: 5 });
  const reservations = useGetMyReservations({ page: 1, limit: 5 });

  const eventTotal = events.data?.meta?.total ?? 0;
  const requestRows = requests.data?.data ?? [];
  const requestTotal = requests.data?.meta?.total ?? 0;
  const reservationRows = reservations.data?.data ?? [];
  const reservationTotal = reservations.data?.meta?.total ?? 0;

  const pendingRequests = requestRows.filter((r) => r.status === "PENDING").length;
  const activeReservations = reservationRows.filter((r) =>
    ["ALLOCATED", "PAYMENT_PENDING", "PAYMENT_COMPLETED", "DELIVERY_PENDING"].includes(
      r.status,
    ),
  ).length;

  const isLoading = events.isPending || requests.isPending || reservations.isPending;
  const isError = events.isError || requests.isError || reservations.isError;
  const isEmptyAccount =
    !isLoading &&
    !isError &&
    eventTotal === 0 &&
    requestTotal === 0 &&
    reservationTotal === 0;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Home"
        description="See open outage windows, your requests, and reservations that need action."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Available events"
            value={String(eventTotal)}
            description="Outage windows open for requests"
          />
          <StatCard
            title="My requests"
            value={String(requestTotal)}
            description={`${pendingRequests} pending on this page`}
          />
          <StatCard
            title="My reservations"
            value={String(reservationTotal)}
            description={`${activeReservations} in-flight on this page`}
          />
          <StatCard
            title="Quick links"
            value="Browse"
            description="Events, requests, reservations"
          />
        </div>
      )}

      {isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(
            events.error ?? requests.error ?? reservations.error,
            "Could not load your dashboard data.",
          )}
        </p>
      ) : null}

      {isEmptyAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              You have not joined any outage events yet. Browse available events to submit a
              capacity request when you need backup power.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/consumer/events" />}>Browse available events</Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <OverviewTable
          title="Latest requests"
          subtitle="Most recent from my-requests"
          columns={["Event", "kW", "Status", "Priority"]}
          rows={requestRows.map((row) => ({
            id: row.id,
            primary: row.event
              ? formatEventDate(row.event.scheduledStart)
              : row.eventId.slice(0, 8),
            secondary: `${row.requestedKw} kW`,
            status: row.status,
            meta: row.priorityTier,
          }))}
          emptyMessage="No requests yet."
          statusRenderer={(status) => (
            <RequestStatusBadge status={status as never} />
          )}
        />
        <OverviewTable
          title="Latest reservations"
          subtitle="Most recent from my-reservations"
          columns={["Event", "kW", "Status", "Amount"]}
          rows={reservationRows.map((row) => ({
            id: row.id,
            primary: row.offer?.event
              ? formatEventDate(row.offer.event.scheduledStart)
              : row.id.slice(0, 8),
            secondary: `${row.allocatedKw} kW`,
            status: row.status,
            meta: formatMoney(row.totalAmount),
          }))}
          emptyMessage="No reservations yet."
          statusRenderer={(status) => (
            <ReservationStatusBadge status={status as never} />
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" render={<Link href="/consumer/events" />}>
          Events
        </Button>
        <Button variant="outline" size="sm" render={<Link href="/consumer/requests" />}>
          My requests
        </Button>
        <Button variant="outline" size="sm" render={<Link href="/consumer/reservations" />}>
          My reservations
        </Button>
      </div>
    </div>
  );
}
