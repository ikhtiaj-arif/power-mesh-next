"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

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
import { toast } from "@/components/ui/toast";
import {
  useCancelReservation,
  useGetMe,
  useGetMyReservations,
  useInitiatePayment,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  CANCELABLE_RESERVATION_STATUSES,
  CONSUMER_DELIVERY_LINK_STATUSES,
  PAYABLE_RESERVATION_STATUSES,
} from "@/types";
import type { PaymentProvider } from "@/types";

/**
 * Consumer detail is resolved from the owned my-reservations list, not the
 * unscoped GET /reservation/:id route (P3-07).
 */
export function ReservationDetail({
  reservationId,
  basePath,
}: {
  reservationId: string;
  basePath: string;
}) {
  const router = useRouter();
  const me = useGetMe();
  const list = useGetMyReservations({ page: 1, limit: 50 });
  const cancel = useCancelReservation();
  const initiatePayment = useInitiatePayment();

  const reservation = useMemo(
    () => list.data?.data.find((row) => row.id === reservationId),
    [list.data?.data, reservationId],
  );

  const consumerId = me.data?.data.consumer?.id;
  const owned =
    reservation && consumerId ? reservation.consumerId === consumerId : false;
  const canCancel =
    owned &&
    reservation &&
    CANCELABLE_RESERVATION_STATUSES.includes(reservation.status);
  const canPay =
    owned &&
    reservation &&
    PAYABLE_RESERVATION_STATUSES.includes(reservation.status);
  const canOpenDelivery =
    owned &&
    reservation &&
    CONSUMER_DELIVERY_LINK_STATUSES.includes(reservation.status);

  const startCheckout = (provider: PaymentProvider) => {
    if (!reservation) return;
    initiatePayment.mutate(
      { reservationId: reservation.id, provider },
      {
        onSuccess: (result) => {
          const url = result.checkoutURL || result.bkashURL;
          if (url) {
            window.location.href = url;
          } else {
            toast.add({
              title: "Missing checkout URL",
              description: "The API did not return a checkout URL.",
              type: "error",
            });
          }
        },
        onError: (error) => {
          toast.add({
            title: "Could not start payment",
            description: getApiErrorMessage(error, "Try again."),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="Reservation detail"
          description="Owned reservation from your my-reservations list."
        />
        <Button variant="outline" size="sm" render={<Link href={basePath} />}>
          Back to reservations
        </Button>
      </div>

      {list.isPending || me.isPending ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : null}

      {list.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(list.error, "Could not load reservations.")}
        </p>
      ) : null}

      {!list.isPending && !reservation ? (
        <p className="text-sm text-muted-foreground">
          This reservation is not in your owned list, so it is not shown.
        </p>
      ) : null}

      {reservation && owned ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>Allocation</CardTitle>
                <CardDescription>
                  {formatEventDate(reservation.deliveryStart)} →{" "}
                  {formatEventDate(reservation.deliveryEnd)}
                </CardDescription>
              </div>
              <ReservationStatusBadge status={reservation.status} />
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Allocated"
                value={`${reservation.allocatedKw} kW`}
              />
              <DetailItem
                label="Unit price"
                value={`৳${String(reservation.unitPrice)}/kWh`}
              />
              <DetailItem
                label="Total"
                value={`৳${String(reservation.totalAmount)}`}
              />
              <DetailItem
                label="Payment status"
                value={reservation.paymentStatus}
              />
              <DetailItem
                label="Provider"
                value={reservation.offer?.provider?.companyName ?? "—"}
              />
            </CardContent>
          </Card>

          {canPay ? (
            <Card>
              <CardHeader>
                <CardTitle>Pay for reservation</CardTitle>
                <CardDescription>
                  Choose bKash (BDT) or Stripe Checkout (USD equivalent on the
                  Stripe page; our ledger stays BDT). Return lands on
                  /my-payments; Stripe completion is confirmed by webhook.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  disabled={initiatePayment.isPending}
                  onClick={() => startCheckout("BKASH")}
                >
                  {initiatePayment.isPending
                    ? "Starting checkout…"
                    : "Pay with bKash"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={initiatePayment.isPending}
                  onClick={() => startCheckout("STRIPE")}
                >
                  {initiatePayment.isPending
                    ? "Starting checkout…"
                    : "Pay with Stripe"}
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {canOpenDelivery ? (
            <Card>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
                <CardDescription>
                  Confirm or dispute after the provider reports delivered kW.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  variant="outline"
                  render={
                    <Link href={`/consumer/delivery/${reservation.id}`} />
                  }
                >
                  Open delivery
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {canCancel ? (
            <Card>
              <CardHeader>
                <CardTitle>Cancel reservation</CardTitle>
                <CardDescription>
                  Allowed only from ALLOCATED or PAYMENT_PENDING.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={cancel.isPending}
                  onClick={() => {
                    cancel.mutate(reservation.id, {
                      onSuccess: () => {
                        toast.add({
                          title: "Reservation cancelled",
                          description: "Capacity was released on the offer.",
                          type: "success",
                        });
                        router.push(basePath);
                      },
                      onError: (error) => {
                        toast.add({
                          title: "Could not cancel reservation",
                          description: getApiErrorMessage(error, "Try again."),
                          type: "error",
                        });
                      },
                    });
                  }}
                >
                  {cancel.isPending ? "Cancelling…" : "Cancel reservation"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">
              Cancel is unavailable outside ALLOCATED and PAYMENT_PENDING.
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium break-words">{value}</p>
    </div>
  );
}
