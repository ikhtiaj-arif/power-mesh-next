"use client";

import Link from "next/link";

import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import {
  formatEventDate,
  isEventScheduleEditable,
} from "@/components/modules/events/event-datetime";
import { EventStatusActions } from "@/components/modules/events/event-status-actions";
import { EventStatusBadge } from "@/components/modules/events/event-status-badge";
import { UpdateEventForm } from "@/components/modules/events/update-event-form";
import { EventRequestPanel } from "@/components/modules/requests/event-request-panel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEventById } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";

export function EventDetail({
  eventId,
  basePath,
  canManage = false,
}: {
  eventId: string;
  basePath: string;
  canManage?: boolean;
}) {
  const detail = useGetEventById(eventId);
  const event = detail.data;
  const canEditSchedule = Boolean(event && isEventScheduleEditable(event));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="Event detail"
          description="Schedule, capacity, and current status for this outage window."
        />
        <Button variant="outline" size="sm" render={<Link href={basePath} />}>
          Back to events
        </Button>
      </div>

      {detail.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : null}

      {detail.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(detail.error, "Could not load this event.")}
        </p>
      ) : null}

      {event ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>Outage window</CardTitle>
                <CardDescription>
                  {formatEventDate(event.scheduledStart)} →{" "}
                  {formatEventDate(event.scheduledEnd)}
                </CardDescription>
              </div>
              <EventStatusBadge status={event.status} />
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Total capacity"
                value={`${event.totalCapacityKw} kW`}
              />
              <DetailItem
                label="Survival quota"
                value={`${event.survivalQuotaKw} kW`}
              />
              <DetailItem
                label="Allocated"
                value={`${event.allocatedKw} kW`}
              />
              <DetailItem
                label="Actual start"
                value={formatEventDate(event.actualStart)}
              />
              <DetailItem
                label="Actual end"
                value={formatEventDate(event.actualEnd)}
              />
              <DetailItem label="Notes" value={event.notes ?? "None"} />
            </CardContent>
          </Card>

          {canManage && canEditSchedule ? <UpdateEventForm event={event} /> : null}
          {canManage && event.status === "SCHEDULED" && !canEditSchedule ? (
            <p className="text-sm text-muted-foreground">
              This scheduled window has started or passed, so the schedule is
              locked. Use status actions if you need to cancel it.
            </p>
          ) : null}
          {!canManage ? (
            <EventRequestPanel
              eventId={event.id}
              eventStatus={event.status}
            />
          ) : null}
          <EventStatusActions
            event={event}
            basePath={basePath}
            canManage={canManage}
          />
        </>
      ) : null}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium break-words">{value}</p>
    </div>
  );
}
