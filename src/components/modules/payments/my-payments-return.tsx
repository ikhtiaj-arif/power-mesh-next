"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

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
import { useGetMyPayments } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Payment } from "@/types";

function latestPayment(rows: Payment[]): Payment | undefined {
  if (rows.length === 0) {
    return undefined;
  }
  return [...rows].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];
}

export function MyPaymentsReturn() {
  const searchParams = useSearchParams();
  const gatewayHint = searchParams.get("status");

  const payments = useGetMyPayments(
    { page: 1, limit: 20, sortBy: "updatedAt", sortOrder: "desc" },
    { staleTime: 0, refetchOnWindowFocus: true },
  );

  const recent = useMemo(
    () => latestPayment(payments.data?.data ?? []),
    [payments.data?.data],
  );

  const verifiedCompleted = recent?.gatewayStatus === "COMPLETED";
  const verifiedFailed = recent?.gatewayStatus === "FAILED";
  const verifiedProcessing = recent?.gatewayStatus === "PROCESSING";

  const retryReservationId =
    recent?.reservationId &&
    (verifiedFailed ||
      gatewayHint === "cancel" ||
      gatewayHint === "failure" ||
      gatewayHint === "cancelled")
      ? recent.reservationId
      : undefined;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Payment return"
        description="bKash sends the browser here after checkout. Status below comes from the API."
      />

      {gatewayHint ? (
        <p className="text-sm text-muted-foreground">
          The gateway sent you back with{" "}
          <span className="font-medium text-foreground">{gatewayHint}</span>.
          That query is only a hint until the payment record is verified.
        </p>
      ) : null}

      {payments.isPending ? (
        <Skeleton className="h-36 w-full rounded-xl" />
      ) : null}

      {payments.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(payments.error, "Could not verify payment.")}
        </p>
      ) : null}

      {!payments.isPending && !payments.isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Verified payment status</CardTitle>
            <CardDescription>
              {recent
                ? `Latest payment updated ${new Date(recent.updatedAt).toLocaleString()}.`
                : "No payment records on this account yet."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recent ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <PaymentStatusBadge status={recent.gatewayStatus} />
                  <span className="text-sm">
                    ৳{String(recent.amount)} {recent.currency}
                  </span>
                </div>

                {verifiedCompleted ? (
                  <p className="text-sm text-foreground">
                    Payment completed. Your reservation should move to payment
                    completed on the server.
                  </p>
                ) : null}

                {verifiedProcessing ? (
                  <p className="text-sm text-muted-foreground">
                    Payment is still processing. Refresh or wait a moment, then
                    check again.
                  </p>
                ) : null}

                {verifiedFailed ||
                gatewayHint === "cancel" ||
                gatewayHint === "failure" ? (
                  <p className="text-sm text-muted-foreground">
                    Checkout did not complete. When the reservation returns to
                    ALLOCATED you can pay again from the reservation detail.
                  </p>
                ) : null}

                {gatewayHint === "success" && !verifiedCompleted ? (
                  <p className="text-sm text-destructive" role="alert">
                    The URL says success, but no COMPLETED payment was found yet.
                    Do not treat this as paid until the gateway status above
                    shows Completed.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Start payment from an allocated reservation, then return here
                after bKash redirects through the API callback.
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {retryReservationId ? (
                <Button
                  type="button"
                  size="sm"
                  render={
                    <Link href={`/consumer/reservations/${retryReservationId}`} />
                  }
                >
                  Back to reservation to pay again
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                variant="outline"
                render={<Link href="/consumer/payments" />}
              >
                Full payment history
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
