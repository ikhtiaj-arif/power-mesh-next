"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { ReservationStatusBadge } from "@/components/modules/reservations/reservation-status-badge";
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
import { useGetMyReservations } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ReservationStatus } from "@/types";

const STATUS_FILTERS: Array<{ label: string; value?: ReservationStatus }> = [
  { label: "All" },
  { label: "Allocated", value: "ALLOCATED" },
  { label: "Payment pending", value: "PAYMENT_PENDING" },
  { label: "Payment completed", value: "PAYMENT_COMPLETED" },
  { label: "Delivery pending", value: "DELIVERY_PENDING" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function MyReservationsList({ basePath }: { basePath: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const limit = Number(searchParams.get("limit") ?? "10") || 10;
  const status =
    (searchParams.get("status") as ReservationStatus | null) ?? undefined;

  const params = useMemo(() => ({ page, limit, status }), [page, limit, status]);
  const reservations = useGetMyReservations(params);
  const rows = reservations.data?.data ?? [];
  const meta = reservations.data?.meta;

  function patchParams(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (!value) next.delete(key);
      else next.set(key, value);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="My reservations"
        description="Allocated capacity bookings from your requests and offers."
      />

      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>
            Open a reservation to pay or follow delivery.
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

          {reservations.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : null}

          {reservations.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getApiErrorMessage(
                reservations.error,
                "Could not load reservations.",
              )}
            </p>
          ) : null}

          {!reservations.isPending && !reservations.isError ? (
            rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reservations yet. Create a request, then reserve an offer on
                an event.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Allocation</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div className="font-medium">
                            {formatEventDate(reservation.deliveryStart)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            to {formatEventDate(reservation.deliveryEnd)}
                          </div>
                        </TableCell>
                        <TableCell>{reservation.allocatedKw} kW</TableCell>
                        <TableCell>
                          ৳{String(reservation.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <ReservationStatusBadge status={reservation.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            render={
                              <Link href={`${basePath}/${reservation.id}`} />
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
                        patchParams({
                          page: String(page - 1),
                          limit: String(limit),
                        })
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
                        patchParams({
                          page: String(page + 1),
                          limit: String(limit),
                        })
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
