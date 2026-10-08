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
import { useGetMyEvents } from "@/hooks";
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

export function OperatorEventsList({ basePath }: { basePath: string }) {
  const [status, setStatus] = useState<OutageEventStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const params = useMemo(
    () => ({ page, limit: 10, status }),
    [page, status],
  );
  const events = useGetMyEvents(params);
  const rows = events.data?.data ?? [];
  const meta = events.data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="My events"
          description="Manage outage windows you created as an operator."
        />
        <Button render={<Link href={`${basePath}/new`} />}>Create event</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event book</CardTitle>
          <CardDescription>
            Filter by status to find windows that need action.
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
              {getApiErrorMessage(events.error, "Could not load your events.")}
            </p>
          ) : null}

          {!events.isPending && !events.isError ? (
            rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No events match this filter. Create one to get started.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Window</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Offers / Requests</TableHead>
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
                        <TableCell>
                          {event.totalCapacityKw} kW
                          <div className="text-xs text-muted-foreground">
                            quota {event.survivalQuotaKw} kW
                          </div>
                        </TableCell>
                        <TableCell>
                          <EventStatusBadge status={event.status} />
                        </TableCell>
                        <TableCell>
                          {event._count?.capacityOffers ?? 0} /{" "}
                          {event._count?.capacityRequests ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            render={<Link href={`${basePath}/${event.id}`} />}
                          >
                            Manage
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
