"use client";

import Link from "next/link";
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
import { useGetMyRequests } from "@/hooks";
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

export function MyRequestsList({ basePath }: { basePath: string }) {
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
  const requests = useGetMyRequests(params);
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
        title="My requests"
        description="Capacity requests you submitted for outage events."
      />

      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>
            Filters use URL search params (`status`, `priorityTier`, `page`).
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
              Any priority
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
              <p className="text-sm text-muted-foreground">
                No requests match these filters. Browse events to create one.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event window</TableHead>
                      <TableHead>Request</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="font-medium">
                            {formatEventDate(request.event?.scheduledStart)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            to {formatEventDate(request.event?.scheduledEnd)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.requestedKw} kW
                          <div className="text-xs text-muted-foreground">
                            max ৳{String(request.maxPricePerKwh)}/kWh
                          </div>
                        </TableCell>
                        <TableCell>{request.priorityTier}</TableCell>
                        <TableCell>
                          <RequestStatusBadge status={request.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            render={
                              <Link href={`${basePath}/${request.id}`} />
                            }
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
