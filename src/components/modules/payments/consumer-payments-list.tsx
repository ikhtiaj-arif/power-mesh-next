"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { PaymentStatusBadge } from "@/components/modules/payments/payment-status-badge";
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
import { useGetMyPayments } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";

export function ConsumerPaymentsList() {
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ page, limit: 10 }), [page]);
  const payments = useGetMyPayments(params);
  const rows = payments.data?.data ?? [];
  const meta = payments.data?.meta;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Payments"
        description="Your checkout history from GET /payments/my-payments (bKash and Stripe)."
      />

      <Card>
        <CardHeader>
          <CardTitle>Payment history</CardTitle>
          <CardDescription>
            Amounts are in BDT. Status reflects the gateway record, not the URL
            query on return.
            {meta
              ? ` Page ${meta.page} of ${meta.totalPages} (${meta.total} total).`
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {payments.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : null}

          {payments.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getApiErrorMessage(payments.error, "Could not load payments.")}
            </p>
          ) : null}

          {!payments.isPending && !payments.isError ? (
            rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No payments yet. Pay an allocated reservation with bKash or
                Stripe to start checkout.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Gateway status</TableHead>
                      <TableHead>Reservation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {formatEventDate(payment.createdAt)}
                        </TableCell>
                        <TableCell>৳{String(payment.amount)}</TableCell>
                        <TableCell>{payment.currency}</TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.gatewayStatus} />
                        </TableCell>
                        <TableCell>
                          {payment.reservation ? (
                            <Link
                              href={`/consumer/reservations/${payment.reservation.id}`}
                              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                              View reservation
                            </Link>
                          ) : (
                            "—"
                          )}
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
