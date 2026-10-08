"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { EventStatusBadge } from "@/components/modules/events/event-status-badge";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllEvents } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { OutageEventStatus } from "@/types";

const STATUS_FILTERS: Array<{ label: string; value?: OutageEventStatus }> = [
  { label: "All" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function AdminEventsList({ basePath }: { basePath: string }) {
  const [status, setStatus] = useState<OutageEventStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const params = useMemo(
    () => ({ page, limit: 10, status }),
    [page, status],
  );
  const events = useGetAllEvents(params);
  const rows = events.data?.data ?? [];
  const meta = events.data?.meta;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="All events"
        description="Read-only platform event list. Admins cannot create or update events."
      />

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            All outage windows on the platform. Operators own create and status changes.
            {meta
              ? ` Page ${meta.page} of ${meta.totalPages} (${meta.total} total).`
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => {
              const active = status === filter.value;
              return (
                <Button
                  key={filter.label}
                  type="button"
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => {
                    setPage(1);
                    setStatus(filter.value);
                  }}
                >
                  {filter.label}
                </Button>
              );
            })}
          </div>

          {events.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : null}

          {events.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getApiErrorMessage(events.error, "Could not load events.")}
            </p>
          ) : null}

          {!events.isPending && !events.isError ? (
            rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No events match this filter.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Window</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="font-medium">
                            {formatEventDate(event.scheduledStart)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            to {formatEventDate(event.scheduledEnd)}
                          </div>
                        </TableCell>
                        <TableCell>{event.totalCapacityKw} kW</TableCell>
                        <TableCell>
                          <EventStatusBadge status={event.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            render={<Link href={`${basePath}/${event.id}`} />}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {meta && meta.totalPages > 1 ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => setPage((current) => current - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={page >= meta.totalPages}
                      onClick={() => setPage((current) => current + 1)}
                    >
                      Next
                    </Button>
                  </div>
                ) : null}
              </>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
