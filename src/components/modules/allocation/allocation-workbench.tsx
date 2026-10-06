"use client";

import { useMemo, useState } from "react";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { EventStatusBadge } from "@/components/modules/events/event-status-badge";
import { ReservationStatusOverride } from "@/components/modules/allocation/reservation-status-override";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import {
  useApproveAllocation,
  useGetAllEvents,
  useGetAllReservations,
  useGetMyEvents,
  usePreviewAllocation,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { AllocationPreviewResult, OutageEventStatus } from "@/types";

const ALLOCATABLE_STATUSES: OutageEventStatus[] = ["SCHEDULED", "CONFIRMED"];

function formatMoney(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return `৳${Number.isFinite(n) ? n.toLocaleString() : "0"}`;
}

export function AllocationWorkbench({
  eventSource,
  title = "Allocation",
  description = "Preview the allocator plan, then approve to create reservations. Matching is all-or-nothing per request (full kW within budget). Survival quota on events is recorded but not enforced by the allocator.",
}: {
  eventSource: "my" | "all";
  title?: string;
  description?: string;
}) {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [preview, setPreview] = useState<AllocationPreviewResult | null>(null);

  const myEventsQuery = useGetMyEvents({ page: 1, limit: 50 }, eventSource === "my");
  const allEventsQuery = useGetAllEvents({ page: 1, limit: 50 }, eventSource === "all");
  const eventsQuery = eventSource === "my" ? myEventsQuery : allEventsQuery;

  const eligibleEvents = useMemo(
    () =>
      (eventsQuery.data?.data ?? []).filter((event) =>
        ALLOCATABLE_STATUSES.includes(event.status),
      ),
    [eventsQuery.data?.data],
  );

  const previewMutation = usePreviewAllocation(selectedEventId);
  const approveMutation = useApproveAllocation(selectedEventId);

  const reservations = useGetAllReservations(
    { page: 1, limit: 20, eventId: selectedEventId },
    Boolean(selectedEventId),
  );

  function runPreview() {
    if (!selectedEventId) {
      return;
    }
    previewMutation.mutate(undefined, {
      onSuccess: (response) => {
        setPreview(response.data);
        toast.add({
          title: "Preview ready",
          description: `${response.data.allocatedRequests} request(s) would allocate (${response.data.totalAllocatedKw} kW). No reservations were created.`,
          type: "success",
        });
      },
      onError: (error) => {
        setPreview(null);
        toast.add({
          title: "Preview failed",
          description: getApiErrorMessage(error, "Could not compute allocation."),
          type: "error",
        });
      },
    });
  }

  function runApprove() {
    if (!selectedEventId) {
      return;
    }
    const confirmed = window.confirm(
      "Approve this allocation plan? This creates reservations and updates offers and requests. This cannot be undone from this screen.",
    );
    if (!confirmed) {
      return;
    }
    approveMutation.mutate(undefined, {
      onSuccess: (response) => {
        setPreview({
          ...response.data,
          allocations: preview?.allocations ?? [],
        });
        void reservations.refetch();
        toast.add({
          title: "Allocation approved",
          description: `Created ${response.data.allocatedRequests} reservation(s), ${response.data.totalAllocatedKw} kW total.`,
          type: "success",
        });
      },
      onError: (error) => {
        toast.add({
          title: "Approve failed",
          description: getApiErrorMessage(error, "Could not approve allocation."),
          type: "error",
        });
      },
    });
  }

  return (
    <div className="space-y-6">
      <OverviewHeader title={title} description={description} />

      <Card>
        <CardHeader>
          <CardTitle>Select event</CardTitle>
          <CardDescription>
            {eventSource === "my"
              ? "Events you operate that are scheduled or confirmed."
              : "Read-only event list (admin). Only scheduled or confirmed events can allocate."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {eventsQuery.isPending ? (
            <Skeleton className="h-10 w-full max-w-md" />
          ) : eventsQuery.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getApiErrorMessage(eventsQuery.error, "Could not load events.")}
            </p>
          ) : eligibleEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No scheduled or confirmed events are available for allocation.
            </p>
          ) : (
            <div className="flex max-w-md flex-col gap-2">
              <Label htmlFor="allocation-event">Event</Label>
              <select
                id="allocation-event"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedEventId}
                onChange={(event) => {
                  setSelectedEventId(event.target.value);
                  setPreview(null);
                }}
              >
                <option value="">Choose an event…</option>
                {eligibleEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {formatEventDate(event.scheduledStart)} — {event.totalCapacityKw} kW (
                    {event.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={!selectedEventId || previewMutation.isPending}
              onClick={runPreview}
            >
              {previewMutation.isPending ? "Previewing…" : "Preview allocation"}
            </Button>
            <Button
              type="button"
              variant="default"
              disabled={!selectedEventId || !preview || approveMutation.isPending}
              onClick={runApprove}
            >
              {approveMutation.isPending ? "Approving…" : "Approve allocation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {preview ? (
        <Card>
          <CardHeader>
            <CardTitle>Allocation plan</CardTitle>
            <CardDescription>
              Preview only until you approve. Event status:{" "}
              <EventStatusBadge status={preview.eventStatus as OutageEventStatus} />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Pending requests</dt>
                <dd className="font-medium">{preview.totalRequests}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Would allocate</dt>
                <dd className="font-medium">
                  {preview.allocatedRequests} ({preview.totalAllocatedKw} kW)
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Skipped</dt>
                <dd className="font-medium">{preview.skipped.length}</dd>
              </div>
            </dl>

            {preview.allocations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Offer</TableHead>
                    <TableHead>kW</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.allocations.map((row) => (
                    <TableRow key={`${row.requestId}-${row.offerId}`}>
                      <TableCell className="font-mono text-xs">{row.requestId.slice(0, 8)}…</TableCell>
                      <TableCell className="font-mono text-xs">{row.offerId.slice(0, 8)}…</TableCell>
                      <TableCell>{row.allocatedKw}</TableCell>
                      <TableCell>{formatMoney(row.totalAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No requests match available offers at their max price.
              </p>
            )}

            {preview.skipped.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Skipped requests</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {preview.skipped.map((item) => (
                    <li key={item.requestId}>
                      <span className="font-mono text-xs">{item.requestId.slice(0, 8)}…</span> —{" "}
                      {item.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {selectedEventId ? (
        <Card>
          <CardHeader>
            <CardTitle>Reservations on this event</CardTitle>
            <CardDescription>
              Override reservation status for support (destructive). bKash refunds on FAILED or
              REFUNDED are best-effort when gateway IDs exist; check payment gateway status after
              submit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reservations.isPending ? (
              <Skeleton className="h-20 w-full" />
            ) : reservations.isError ? (
              <p className="text-sm text-destructive" role="alert">
                {getApiErrorMessage(reservations.error, "Could not load reservations.")}
              </p>
            ) : (reservations.data?.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reservations for this event yet. Approve allocation or wait for consumer bookings.
              </p>
            ) : (
              <div className="space-y-6">
                {(reservations.data?.data ?? []).map((reservation) => (
                  <ReservationStatusOverride key={reservation.id} reservation={reservation} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
