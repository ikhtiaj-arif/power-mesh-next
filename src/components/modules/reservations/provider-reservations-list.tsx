"use client";

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

const STATUS_FILTERS: Array<{ label: string; value?: ReservationStatus }> = [
  { label: "All" },
  { label: "Allocated", value: "ALLOCATED" },
  { label: "Payment pending", value: "PAYMENT_PENDING" },
  { label: "Payment completed", value: "PAYMENT_COMPLETED" },
  { label: "Delivery pending", value: "DELIVERY_PENDING" },
];

export function ProviderReservationsList() {
  const me = useGetMe();
  const providerId = me.data?.data.provider?.id ?? "";
  const [status, setStatus] = useState<ReservationStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const params = useMemo(
    () => ({ page, limit: 10, status }),
    [page, status],
  );
  const reservations = useGetProviderReservations(providerId, params);
  const rows = reservations.data?.data ?? [];
  const meta = reservations.data?.meta;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Provider reservations"
        description="Reservations allocated against your offers."
      />

      {!providerId && !me.isPending ? (
        <p className="text-sm text-muted-foreground">
          No provider profile on this account.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>
            Reservations allocated against your offers.
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
                "Could not load provider reservations.",
              )}
            </p>
          ) : null}

          {!reservations.isPending && !reservations.isError && providerId ? (
            rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reservations for this provider yet.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Allocated</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
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
