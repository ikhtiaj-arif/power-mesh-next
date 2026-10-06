"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  formatEventDate,
} from "@/components/modules/events/event-datetime";
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
import { useGetAvailableEvents } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";

export function AvailableEventsList({ basePath }: { basePath: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const limit = Number(searchParams.get("limit") ?? "10") || 10;

  const params = useMemo(
    () => ({
      page,
      limit,
      sortBy: "scheduledStart" as const,
      sortOrder: "asc" as const,
    }),
    [page, limit],
  );

  const events = useGetAvailableEvents(params);
  const rows = events.data?.data ?? [];
  const meta = events.data?.meta;

  function setPage(nextPage: number) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(nextPage));
    next.set("limit", String(limit));
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Available events"
        description="Upcoming scheduled and confirmed outage windows you can use."
      />

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Sorted by scheduled start. Pagination uses API meta.
            {meta ? ` Showing page ${meta.page} of ${meta.totalPages} (${meta.total} total).` : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                No available events right now.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Window</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Offers</TableHead>
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
                            allocated {event.allocatedKw} kW
                          </div>
                        </TableCell>
                        <TableCell>
                          <EventStatusBadge status={event.status} />
                        </TableCell>
                        <TableCell>
                          {event._count?.capacityOffers ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            render={<Link href={`${basePath}/${event.id}`} />}
                          >
                            Open
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
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={page >= meta.totalPages}
                      onClick={() => setPage(page + 1)}
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
