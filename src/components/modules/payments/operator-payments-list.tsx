"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { Badge } from "@/components/ui/badge";
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
import { useGetAllPayments } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { PaymentStatus } from "@/types";
import { PAYMENT_GATEWAY_STATUSES } from "@/types";

function formatMoney(value: number | string, currency: string) {
  const n = typeof value === "string" ? Number(value) : value;
  return `${currency} ${Number.isFinite(n) ? n.toLocaleString() : "0"}`;
}

export function OperatorPaymentsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const limit = Number(searchParams.get("limit") ?? "10") || 10;
  const gatewayStatus =
    (searchParams.get("gatewayStatus") as PaymentStatus | null) ?? undefined;

  const params = useMemo(
    () => ({ page, limit, gatewayStatus }),
    [page, limit, gatewayStatus],
  );
  const payments = useGetAllPayments(params);
  const rows = payments.data?.data ?? [];
  const meta = payments.data?.meta;

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
        title="Payments"
        description="Read-only gateway payments across the platform. Refunds are handled from reservation status overrides."
      />

      <Card>
        <CardHeader>
          <CardTitle>All payments</CardTitle>
          <CardDescription>
            Filter by `gatewayStatus` in the URL.
            {meta
              ? ` Page ${meta.page} of ${meta.totalPages} (${meta.total} total).`
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={!gatewayStatus ? "default" : "outline"}
              onClick={() =>
                patchParams({ gatewayStatus: undefined, page: "1", limit: String(limit) })
              }
            >
              All statuses
            </Button>
            {PAYMENT_GATEWAY_STATUSES.map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={gatewayStatus === status ? "default" : "outline"}
                onClick={() =>
                  patchParams({
                    gatewayStatus: status,
                    page: "1",
                    limit: String(limit),
                  })
                }
              >
                {status}
              </Button>
            ))}
          </div>

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
              <p className="text-sm text-muted-foreground">No payments match this filter.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Consumer</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Gateway</TableHead>
                      <TableHead>Reservation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((payment) => {
                      const consumer = payment.reservation?.consumer?.user;
                      const event = payment.reservation?.offer?.event;
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {consumer ? (
                              <>
                                <div className="font-medium">
                                  {consumer.firstName} {consumer.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {consumer.email}
                                </div>
                              </>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {event ? formatEventDate(event.scheduledStart) : "—"}
                          </TableCell>
                          <TableCell>
                            {formatMoney(payment.amount, payment.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.gatewayStatus}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.reservationId.slice(0, 8)}…
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
