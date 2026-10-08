"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
  useCreateReservation,
  useGetMe,
  useGetMyRequests,
  useGetOffersByEvent,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CapacityOffer } from "@/types";

export function EventReservationPanel({ eventId }: { eventId: string }) {
  const router = useRouter();
  const me = useGetMe();
  const role = me.data?.data.role;
  const offers = useGetOffersByEvent(eventId, { page: 1, limit: 20 });
  const myRequests = useGetMyRequests({ page: 1, limit: 50 });
  const create = useCreateReservation();
  const [pendingOffer, setPendingOffer] = useState<CapacityOffer | null>(null);

  const pendingRequest = myRequests.data?.data.find(
    (request) => request.eventId === eventId && request.status === "PENDING",
  );

  if (role !== "CONSUMER") {
    return null;
  }

  if (offers.isPending || myRequests.isPending) {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  if (offers.isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {getApiErrorMessage(offers.error, "Could not load offers.")}
      </p>
    );
  }

  const rows = offers.data?.data ?? [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Offers on this event</CardTitle>
          <CardDescription>
            Reserve against your pending request. Pay from the reservation
            detail once you are allocated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!pendingRequest ? (
            <p className="text-sm text-muted-foreground">
              Create a pending capacity request for this event before reserving
              an offer.
            </p>
          ) : null}

          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No offers on this event yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {rows.map((offer) => {
                const remaining = offer.capacityKw - offer.reservedKw;
                const canReserve =
                  Boolean(pendingRequest) &&
                  (offer.status === "AVAILABLE" ||
                    offer.status === "PARTIALLY_AVAILABLE") &&
                  remaining >= (pendingRequest?.requestedKw ?? Infinity);

                return (
                  <li
                    key={offer.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border/70 p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {offer.provider?.companyName ?? "Provider"} ·{" "}
                        {remaining}/{offer.capacityKw} kW left
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ৳{String(offer.pricePerKwh)}/kWh ·{" "}
                        {formatEventDate(offer.deliveryStart)} →{" "}
                        {formatEventDate(offer.deliveryEnd)} · {offer.status}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      disabled={!canReserve || create.isPending}
                      onClick={() => setPendingOffer(offer)}
                    >
                      Reserve
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingOffer)}
        onOpenChange={(open) => {
          if (!open) setPendingOffer(null);
        }}
        title="Reserve this offer?"
        description={
          pendingOffer && pendingRequest
            ? `Reserve ${pendingRequest.requestedKw} kW from ${pendingOffer.provider?.companyName ?? "this provider"} at ৳${String(pendingOffer.pricePerKwh)}/kWh.`
            : "Confirm the reservation."
        }
        confirmLabel="Confirm reserve"
        loading={create.isPending}
        onConfirm={() =>
          new Promise<void>((resolve, reject) => {
            if (!pendingOffer || !pendingRequest) {
              resolve();
              return;
            }
            create.mutate(
              {
                offerId: pendingOffer.id,
                requestId: pendingRequest.id,
              },
              {
                onSuccess: (response) => {
                  const id = response.data?.id;
                  toast.add({
                    title: "Reservation created",
                    description:
                      "You are allocated. Open the reservation to pay with bKash.",
                    type: "success",
                  });
                  setPendingOffer(null);
                  if (id) {
                    router.push(`/consumer/reservations/${id}`);
                  }
                  resolve();
                },
                onError: (error) => {
                  toast.add({
                    title: "Could not create reservation",
                    description: getApiErrorMessage(
                      error,
                      "Try another offer.",
                    ),
                    type: "error",
                  });
                  reject(error);
                },
              },
            );
          })
        }
      />
    </>
  );
}
