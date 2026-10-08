"use client";

import Link from "next/link";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { EmptyState } from "@/components/modules/dashboard/empty-state";
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
  const needsPay = reservationRows.filter((r) =>
    ["ALLOCATED", "PAYMENT_PENDING"].includes(r.status),
  );
  const needsDelivery = reservationRows.filter((r) =>
    ["PAYMENT_COMPLETED", "DELIVERY_PENDING"].includes(r.status),
  );
  const nextEvent = events.data?.data?.[0];

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
        actions={
          <Button size="sm" render={<Link href="/consumer/events" />}>
            Browse events
          </Button>
        }
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
            description={`${needsPay.length + needsDelivery.length} need action`}
          />
          <StatCard
            title="Next window"
            value={
              nextEvent
                ? formatEventDate(nextEvent.scheduledStart).split(",")[0] ?? "—"
                : "—"
            }
            description={
              nextEvent
                ? `${Math.max(0, nextEvent.totalCapacityKw - nextEvent.allocatedKw)} kW remaining`
                : "No open events yet"
            }
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
        <EmptyState
          title="Get started"
          description="You have not joined any outage events yet. Browse available windows to request backup kilowatts."
          action={
            <Button render={<Link href="/consumer/events" />}>
              Browse available events
            </Button>
          }
        />
      ) : null}

      {!isLoading && (needsPay.length > 0 || needsDelivery.length > 0) ? (
        <Card>
          <CardHeader>
            <CardTitle>Needs you</CardTitle>
            <CardDescription>
              Finish payment or confirm delivery for these reservations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {needsPay.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <span>
                  Pay {formatMoney(row.totalAmount)} · {row.allocatedKw} kW
                </span>
                <Button
                  size="sm"
                  render={<Link href={`/consumer/reservations/${row.id}`} />}
                >
                  Pay now
                </Button>
              </div>
            ))}
            {needsDelivery.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <span>Confirm delivery · {row.allocatedKw} kW</span>
                <Button
                  size="sm"
                  variant="outline"
                  render={
                    <Link href={`/consumer/delivery/${row.id}`} />
                  }
                >
                  Open delivery
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <OverviewTable
          title="Latest requests"
          subtitle="Tap a row to open the request"
          columns={["Event", "kW", "Status", "Priority"]}
          rows={requestRows.map((row) => ({
            id: row.id,
            primary: row.event
              ? formatEventDate(row.event.scheduledStart)
              : row.eventId.slice(0, 8),
            secondary: `${row.requestedKw} kW`,
            status: row.status,
            meta: row.priorityTier,
            href: `/consumer/requests/${row.id}`,
          }))}
          emptyMessage="No requests yet. Open an event and request kilowatts."
          statusRenderer={(status) => (
            <RequestStatusBadge status={status as never} />
          )}
        />
        <OverviewTable
          title="Latest reservations"
          subtitle="Tap a row to open the reservation"
          columns={["Event", "kW", "Status", "Amount"]}
          rows={reservationRows.map((row) => ({
            id: row.id,
            primary: row.offer?.event
              ? formatEventDate(row.offer.event.scheduledStart)
              : row.id.slice(0, 8),
            secondary: `${row.allocatedKw} kW`,
            status: row.status,
            meta: formatMoney(row.totalAmount),
            href: `/consumer/reservations/${row.id}`,
          }))}
          emptyMessage="No reservations yet. Reserve an offer after your request is pending."
          statusRenderer={(status) => (
            <ReservationStatusBadge status={status as never} />
          )}
        />
      </div>
    </div>
  );
}
