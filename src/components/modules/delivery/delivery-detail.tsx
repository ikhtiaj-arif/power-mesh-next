"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { DeliveryStatusBadge } from "@/components/modules/delivery/delivery-status-badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  useConsumerConfirmDelivery,
  useConsumerDisputeDelivery,
  useGetDeliveryByReservation,
  useGetMe,
  useProviderCheckIn,
  useProviderReport,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { DELIVERY_WINDOW_RESERVATION_STATUSES } from "@/types";

type DeliveryDetailProps = {
  reservationId: string;
  role: "consumer" | "provider";
  backHref: string;
};

export function DeliveryDetail({
  reservationId,
  role,
  backHref,
}: DeliveryDetailProps) {
  const me = useGetMe();
  const detail = useGetDeliveryByReservation(reservationId);
  const checkIn = useProviderCheckIn();
  const report = useProviderReport();
  const confirm = useConsumerConfirmDelivery();
  const dispute = useConsumerDisputeDelivery();

  const [reportKw, setReportKw] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [showDispute, setShowDispute] = useState(false);

  const reservation = detail.data;
  const delivery = reservation?.delivery ?? null;

  const consumerId = me.data?.data.consumer?.id;
  const providerId = me.data?.data.provider?.id;
  const isConsumerOwner =
    role === "consumer" &&
    reservation &&
    consumerId &&
    reservation.consumerId === consumerId;
  const isProviderOwner =
    role === "provider" &&
    reservation &&
    providerId &&
    reservation.providerId === providerId;

  const inDeliveryWindow =
    reservation &&
    DELIVERY_WINDOW_RESERVATION_STATUSES.includes(reservation.status);

  const canCheckIn = isProviderOwner && inDeliveryWindow;

  const canReport = isProviderOwner && inDeliveryWindow;

  const hasReport =
    delivery?.actualDeliveredKw !== null &&
    delivery?.actualDeliveredKw !== undefined;

  const canConfirm =
    isConsumerOwner &&
    inDeliveryWindow &&
    hasReport &&
    delivery?.status !== "CONFIRMED" &&
    delivery?.status !== "PARTIAL" &&
    delivery?.status !== "DISPUTED";

  const canDispute =
    isConsumerOwner &&
    inDeliveryWindow &&
    hasReport &&
    delivery?.status !== "DISPUTED" &&
    delivery?.status !== "CONFIRMED" &&
    delivery?.status !== "PARTIAL";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="Delivery detail"
          description={`Reservation ${reservationId.slice(0, 8)}… from GET /delivery/:reservationId.`}
        />
        <Button variant="outline" size="sm" render={<Link href={backHref} />}>
          Back
        </Button>
      </div>

      {detail.isPending || me.isPending ? (
        <Skeleton className="h-48 w-full rounded-xl" />
      ) : null}

      {detail.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(detail.error, "Could not load delivery.")}
        </p>
      ) : null}

      {reservation ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>Reservation</CardTitle>
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
                label="Reported delivered"
                value={
                  delivery?.actualDeliveredKw != null
                    ? `${delivery.actualDeliveredKw} kW`
                    : "Not reported yet"
                }
              />
              <DetailItem
                label="Delivery status"
                value={
                  delivery ? (
                    <DeliveryStatusBadge status={delivery.status} />
                  ) : (
                    "No delivery row yet"
                  )
                }
              />
              {delivery?.disputeReason ? (
                <DetailItem
                  label="Dispute reason"
                  value={delivery.disputeReason}
                />
              ) : null}
            </CardContent>
          </Card>

          {role === "provider" && isProviderOwner ? (
            <Card>
              <CardHeader>
                <CardTitle>Provider actions</CardTitle>
                <CardDescription>
                  Check-in while payment is completed or delivery is pending.
                  Report actual kW as a whole number.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {canCheckIn ? (
                  <Button
                    type="button"
                    disabled={checkIn.isPending}
                    onClick={() => {
                      checkIn.mutate(reservationId, {
                        onSuccess: (data) => {
                          toast.add({
                            title: "Checked in",
                            description: `Delivery is ${data.status}. Reservation should be DELIVERY_PENDING.`,
                            type: "success",
                          });
                        },
                        onError: (error) => {
                          toast.add({
                            title: "Check-in failed",
                            description: getApiErrorMessage(error, "Try again."),
                            type: "error",
                          });
                        },
                      });
                    }}
                  >
                    {checkIn.isPending ? "Checking in…" : "Provider check-in"}
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Check-in is only available while the reservation is
                    PAYMENT_COMPLETED or DELIVERY_PENDING.
                  </p>
                )}

                {canReport ? (
                  <form
                    className="flex flex-wrap items-end gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const parsed = Number(reportKw);
                      if (!Number.isInteger(parsed) || parsed < 0) {
                        toast.add({
                          title: "Invalid kilowatts",
                          description: "Enter a whole number ≥ 0.",
                          type: "error",
                        });
                        return;
                      }
                      report.mutate(
                        {
                          reservationId,
                          payload: { actualDeliveredKw: parsed },
                        },
                        {
                          onSuccess: (data) => {
                            toast.add({
                              title: "Report saved",
                              description: `Stored ${data.actualDeliveredKw ?? parsed} kW. Delivery is not confirmed until the consumer accepts.`,
                              type: "success",
                            });
                            setReportKw("");
                          },
                          onError: (error) => {
                            toast.add({
                              title: "Report failed",
                              description: getApiErrorMessage(
                                error,
                                "Try again.",
                              ),
                              type: "error",
                            });
                          },
                        },
                      );
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="actual-kw">Actual delivered kW</Label>
                      <Input
                        id="actual-kw"
                        inputMode="numeric"
                        placeholder="e.g. 50"
                        value={reportKw}
                        onChange={(event) => setReportKw(event.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={report.isPending}>
                      {report.isPending ? "Saving…" : "Submit report"}
                    </Button>
                  </form>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {role === "consumer" && isConsumerOwner ? (
            <Card>
              <CardHeader>
                <CardTitle>Consumer actions</CardTitle>
                <CardDescription>
                  Confirm only after the provider reports delivered kW. Partial
                  delivery creates a local refund record; bKash is not called.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {canConfirm ? (
                  <Button
                    type="button"
                    disabled={confirm.isPending}
                    onClick={() => {
                      confirm.mutate(reservationId, {
                        onSuccess: (result) => {
                          if (result.fullDelivery) {
                            toast.add({
                              title: "Delivery confirmed",
                              description:
                                "Full delivery — reservation should show DELIVERY_CONFIRMED.",
                              type: "success",
                            });
                          } else if (result.partialDelivery) {
                            toast.add({
                              title: "Partial delivery recorded",
                              description:
                                "A refund record was created locally. bKash was not called to return money.",
                              type: "success",
                            });
                          }
                        },
                        onError: (error) => {
                          toast.add({
                            title: "Could not confirm",
                            description: getApiErrorMessage(error, "Try again."),
                            type: "error",
                          });
                        },
                      });
                    }}
                  >
                    {confirm.isPending ? "Confirming…" : "Confirm delivery"}
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Confirm is unavailable until a provider report exists and
                    delivery is not already confirmed, partial, or disputed.
                  </p>
                )}

                {canDispute ? (
                  <div className="space-y-3">
                    {!showDispute ? (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setShowDispute(true)}
                      >
                        Dispute delivery
                      </Button>
                    ) : (
                      <form
                        className="space-y-3"
                        onSubmit={(event) => {
                          event.preventDefault();
                          if (disputeReason.trim().length < 5) {
                            return;
                          }
                          dispute.mutate(
                            {
                              reservationId,
                              payload: {
                                disputeReason: disputeReason.trim(),
                              },
                            },
                            {
                              onSuccess: () => {
                                toast.add({
                                  title: "Delivery disputed",
                                  description:
                                    "Delivery is DISPUTED. Reservation status is unchanged.",
                                  type: "success",
                                });
                                setDisputeReason("");
                                setShowDispute(false);
                              },
                              onError: (error) => {
                                toast.add({
                                  title: "Dispute failed",
                                  description: getApiErrorMessage(
                                    error,
                                    "Try again.",
                                  ),
                                  type: "error",
                                });
                              },
                            },
                          );
                        }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="dispute-reason">Dispute reason</Label>
                          <textarea
                            id="dispute-reason"
                            rows={3}
                            className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            value={disputeReason}
                            onChange={(event) =>
                              setDisputeReason(event.target.value)
                            }
                            placeholder="At least 5 characters."
                          />
                          {disputeReason.trim().length > 0 &&
                          disputeReason.trim().length < 5 ? (
                            <p className="text-sm text-destructive">
                              Reason must be at least 5 characters.
                            </p>
                          ) : null}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            variant="destructive"
                            disabled={
                              dispute.isPending ||
                              disputeReason.trim().length < 5
                            }
                          >
                            {dispute.isPending ? "Submitting…" : "Submit dispute"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowDispute(false);
                              setDisputeReason("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {!isConsumerOwner && !isProviderOwner && !detail.isPending ? (
            <p className="text-sm text-muted-foreground">
              This account does not own this reservation for the {role} view.
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-medium break-words">{value}</div>
    </div>
  );
}
