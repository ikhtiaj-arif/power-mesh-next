"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { RequestStatusBadge } from "@/components/modules/requests/request-status-badge";
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
import { useGetAllRequests } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { PriorityTier, RequestStatus } from "@/types";
import { PRIORITY_TIERS } from "@/types";

const STATUS_FILTERS: Array<{ label: string; value?: RequestStatus }> = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Allocated", value: "ALLOCATED" },
  { label: "Fulfilled", value: "FULFILLED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function AllRequestsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const limit = Number(searchParams.get("limit") ?? "10") || 10;
  const status = (searchParams.get("status") as RequestStatus | null) ?? undefined;
  const priorityTier =
    (searchParams.get("priorityTier") as PriorityTier | null) ?? undefined;

  const params = useMemo(
    () => ({ page, limit, status, priorityTier }),
    [page, limit, status, priorityTier],
  );
  const requests = useGetAllRequests(params);
  const rows = requests.data?.data ?? [];
  const meta = requests.data?.meta;

  function patchParams(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="All capacity requests"
        description="Cross-tenant request list for allocation review. Requests cannot be edited from this desk."
      />

      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>
            Filters use URL params (`status`, `priorityTier`, `page`).
            {meta
              ? ` Page ${meta.page} of ${meta.totalPages} (${meta.total} total).`
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter.label}
                type="button"
                size="sm"
                variant={status === filter.value ? "default" : "outline"}
                onClick={() =>
                  patchParams({
                    status: filter.value,
                    page: "1",
                    limit: String(limit),
                  })
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={!priorityTier ? "default" : "outline"}
              onClick={() =>
                patchParams({
                  priorityTier: undefined,
                  page: "1",
                  limit: String(limit),
                })
              }
            >
              All priorities
            </Button>
            {PRIORITY_TIERS.map((tier) => (
              <Button
                key={tier}
                type="button"
                size="sm"
                variant={priorityTier === tier ? "default" : "outline"}
                onClick={() =>
                  patchParams({
                    priorityTier: tier,
                    page: "1",
                    limit: String(limit),
                  })
                }
              >
                {tier}
              </Button>
            ))}
          </div>

          {requests.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : null}

          {requests.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getApiErrorMessage(requests.error, "Could not load requests.")}
            </p>
          ) : null}

          {!requests.isPending && !requests.isError ? (
            rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests match this filter.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event window</TableHead>
                      <TableHead>kW</TableHead>
                      <TableHead>Max ৳/kWh</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          {row.event ? (
                            <>
                              <div className="font-medium">
                                {formatEventDate(row.event.scheduledStart)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {row.event.totalCapacityKw} kW event
                              </div>
                            </>
                          ) : (
                            <span className="font-mono text-xs">{row.eventId.slice(0, 8)}…</span>
                          )}
                        </TableCell>
                        <TableCell>{row.requestedKw}</TableCell>
                        <TableCell>{row.maxPricePerKwh}</TableCell>
                        <TableCell>{row.priorityTier}</TableCell>
                        <TableCell>
                          <RequestStatusBadge status={row.status} />
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
                      onClick={() =>
                        patchParams({ page: String(page - 1), limit: String(limit) })
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={page >= meta.totalPages}
                      onClick={() =>
                        patchParams({ page: String(page + 1), limit: String(limit) })
                      }
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
