"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { EventDetail } from "@/components/modules/events/event-detail";
import { EventStatusBadge } from "@/components/modules/events/event-status-badge";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { RecordSheet } from "@/components/modules/shell/record-sheet";
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
import type { OutageEvent } from "@/types";

type AvailableEventsListProps = {
  basePath: string;
  /** Override the default "Open" detail link (e.g. create offer with eventId). */
  rowAction?: {
    label: string;
    href: (eventId: string) => string;
  };
  title?: string;
  description?: string;
  showHeader?: boolean;
  /** Query param keys when embedded next to another paginated list. */
  pageParamKey?: string;
  limitParamKey?: string;
};

export function AvailableEventsList({
  basePath,
  rowAction,
  title = "Available events",
  description = "Upcoming scheduled and confirmed outage windows you can use.",
  showHeader = true,
  pageParamKey = "page",
  limitParamKey = "limit",
}: AvailableEventsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<OutageEvent | null>(null);

  const page = Number(searchParams.get(pageParamKey) ?? "1") || 1;
  const limit = Number(searchParams.get(limitParamKey) ?? "10") || 10;

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
    next.set(pageParamKey, String(nextPage));
    next.set(limitParamKey, String(limit));
    router.push(`${pathname}?${next.toString()}`);
  }

  const actionLabel = rowAction?.label ?? "Open event";
  const actionHref =
    rowAction?.href ?? ((eventId: string) => `${basePath}/${eventId}`);

  return (
    <div className="space-y-6">
      {showHeader ? (
        <OverviewHeader title={title} description={description} />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{showHeader ? "Events" : title}</CardTitle>
          <CardDescription>
            {description}
            {meta
              ? ` Showing page ${meta.page} of ${meta.totalPages} (${meta.total} total).`
              : null}
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
                            {Math.max(0, event.totalCapacityKw - event.allocatedKw)}{" "}
                            kW remaining
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
                            onClick={() => setSelected(event)}
                          >
                            Preview
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

      <RecordSheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title="Outage window"
        description={
          selected
            ? `${formatEventDate(selected.scheduledStart)} → ${formatEventDate(selected.scheduledEnd)}`
            : undefined
        }
        size="lg"
        footer={
          selected && rowAction ? (
            <Button
              render={<Link href={actionHref(selected.id)} />}
              onClick={() => setSelected(null)}
            >
              {actionLabel}
            </Button>
          ) : null
        }
      >
        {selected ? (
          <EventDetail
            eventId={selected.id}
            basePath={basePath}
            embedded
          />
        ) : null}
      </RecordSheet>
    </div>
  );
}
