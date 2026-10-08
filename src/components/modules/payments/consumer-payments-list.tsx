"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { PaymentStatusBadge } from "@/components/modules/payments/payment-status-badge";
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
import { useGetMyPayments } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { PaymentRecord } from "@/types";

export function ConsumerPaymentsList() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PaymentRecord | null>(null);
  const params = useMemo(() => ({ page, limit: 10 }), [page]);
  const payments = useGetMyPayments(params);
  const rows = payments.data?.data ?? [];
  const meta = payments.data?.meta;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Payments"
        description="Your bKash and card checkout history for reserved capacity."
      />

      <Card>
        <CardHeader>
          <CardTitle>Payment history</CardTitle>
          <CardDescription>
            Amounts are in BDT. Preview a row for receipt details.
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
                No payments yet. Pay an allocated reservation to start checkout.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {formatEventDate(payment.createdAt)}
                        </TableCell>
                        <TableCell>৳{String(payment.amount)}</TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.gatewayStatus} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelected(payment)}
                          >
                            Receipt
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

      <RecordSheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title="Payment receipt"
        description={
          selected ? formatEventDate(selected.createdAt) : undefined
        }
        size="md"
        fullPageHref={
          selected?.reservation
            ? `/consumer/reservations/${selected.reservation.id}`
            : undefined
        }
        fullPageLabel="Open reservation"
      >
        {selected ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Status</span>
              <PaymentStatusBadge status={selected.gatewayStatus} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                ৳{String(selected.amount)} {selected.currency}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium">{selected.paymentMethod}</span>
            </div>
            {selected.bkashTrxId ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">bKash trx</span>
                <span className="font-mono text-xs">{selected.bkashTrxId}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Invoice</span>
              <span className="font-mono text-xs">
                {selected.merchantInvoiceNumber}
              </span>
            </div>
            {selected.reservation ? (
              <Button
                className="w-full"
                variant="outline"
                render={
                  <Link
                    href={`/consumer/reservations/${selected.reservation.id}`}
                  />
                }
                onClick={() => setSelected(null)}
              >
                Continue to reservation
              </Button>
            ) : null}
          </div>
        ) : null}
      </RecordSheet>
    </div>
  );
}
