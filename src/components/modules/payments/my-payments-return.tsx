"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
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
import { useConfirmStripeCheckout, useGetMyPayments } from "@/hooks";
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
  const providerHint = searchParams.get("provider");
  const sessionId = searchParams.get("session_id");
  const confirmedSessionRef = useRef<string | null>(null);

  const payments = useGetMyPayments(
    { page: 1, limit: 20, sortBy: "updatedAt", sortOrder: "desc" },
    { staleTime: 0, refetchOnWindowFocus: true },
  );
  const confirmStripe = useConfirmStripeCheckout();

  useEffect(() => {
    if (
      providerHint !== "stripe" ||
      !sessionId ||
      gatewayHint === "cancel" ||
      confirmedSessionRef.current === sessionId
    ) {
      return;
    }
    confirmedSessionRef.current = sessionId;
    confirmStripe.mutate(sessionId, {
      onSuccess: (payment) => {
        // #region agent log
        fetch("http://127.0.0.1:7698/ingest/d4a25cba-e448-4169-84a8-d32878310aea", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "a75d46",
          },
          body: JSON.stringify({
            sessionId: "a75d46",
            runId: "stripe-logout-fix",
            hypothesisId: "S1",
            location: "my-payments-return.tsx:confirm",
            message: "stripe confirm succeeded",
            data: {
              checkoutSessionId: sessionId,
              gatewayStatus: payment.gatewayStatus,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        void payments.refetch();
      },
      onError: (error) => {
        // #region agent log
        fetch("http://127.0.0.1:7698/ingest/d4a25cba-e448-4169-84a8-d32878310aea", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "a75d46",
          },
          body: JSON.stringify({
            sessionId: "a75d46",
            runId: "stripe-logout-fix",
            hypothesisId: "S1",
            location: "my-payments-return.tsx:confirm",
            message: "stripe confirm failed",
            data: {
              checkoutSessionId: sessionId,
              error: getApiErrorMessage(error, "unknown"),
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        void payments.refetch();
      },
    });
    // mutate/refetch identities are unstable; gate with confirmedSessionRef instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- confirm once per session_id
  }, [gatewayHint, providerHint, sessionId]);

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
        title="Payment status"
        description="You are back from checkout. Confirm the payment status below, then continue to your reservation."
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
                    Payment completed. Continue to your reservation for delivery
                    next steps.
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
                after checkout redirects you back.
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {verifiedCompleted && recent?.reservationId ? (
                <Button
                  type="button"
                  size="sm"
                  render={
                    <Link
                      href={`/consumer/reservations/${recent.reservationId}`}
                    />
                  }
                >
                  Continue to reservation
                </Button>
              ) : null}
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
