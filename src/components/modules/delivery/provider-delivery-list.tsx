"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
import { useGetMe, useGetProviderReservations } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ReservationStatus } from "@/types";
import { PROVIDER_DELIVERY_LIST_STATUSES } from "@/types";

const STATUS_FILTERS: Array<{ label: string; value?: ReservationStatus }> = [
  { label: "All delivery-related" },
  { label: "Payment completed", value: "PAYMENT_COMPLETED" },
  { label: "Delivery pending", value: "DELIVERY_PENDING" },
  { label: "Delivery confirmed", value: "DELIVERY_CONFIRMED" },
  { label: "Partial delivery", value: "DELIVERY_PARTIAL" },
];

export function ProviderDeliveryList() {
  const me = useGetMe();
  const providerId = me.data?.data.provider?.id ?? "";
  const [status, setStatus] = useState<ReservationStatus | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({ page, limit: 10, status }),
    [page, status],
  );
  const reservations = useGetProviderReservations(providerId, params);
  const rows = useMemo(() => {
    const data = reservations.data?.data ?? [];
    if (status) {
      return data;
    }
    return data.filter((row) =>
      PROVIDER_DELIVERY_LIST_STATUSES.includes(row.status),
    );
  }, [reservations.data?.data, status]);
  const meta = reservations.data?.meta;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Delivery"
        description="Reservations in payment-completed or delivery phases."
      />

      {!providerId && !me.isPending ? (
        <p className="text-sm text-muted-foreground">
          No provider profile on this account.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Delivery queue</CardTitle>
          <CardDescription>
            Filtered from your provider reservations. Open a row for check-in
            and kW reporting.
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
                onClick={() => {
                  setPage(1);
                  setStatus(filter.value);
                }}
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

          {!reservations.isPending && !reservations.isError && providerId ? (
            rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No delivery-stage reservations yet.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery window</TableHead>
                      <TableHead>Allocated</TableHead>
                      <TableHead>Reservation</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
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
                          <ReservationStatusBadge status={reservation.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            render={
                              <Link
                                href={`/provider/delivery/${reservation.id}`}
                              />
                            }
                          >
                            Open delivery
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
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={page >= meta.totalPages}
                      onClick={() => setPage((p) => p + 1)}
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
