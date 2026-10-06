"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  formatEventDate,
  toApiDateTime,
  toDateTimeLocalValue,
} from "@/components/modules/events/event-datetime";
import { OfferStatusBadge } from "@/components/modules/offers/offer-status-badge";
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
  useGetOfferById,
  useSoftDeleteOffer,
  useUpdateOffer,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  updateOfferSchema,
  type UpdateOfferValues,
} from "@/validation/offer";

function canEditOffer(status: string | undefined) {
  return status === "AVAILABLE" || status === "PARTIALLY_AVAILABLE";
}

export function UpdateOfferForm({
  offerId,
  basePath,
}: {
  offerId: string;
  basePath: string;
}) {
  const router = useRouter();
  const detail = useGetOfferById(offerId);
  const offer = detail.data;
  const update = useUpdateOffer(offerId);
  const softDelete = useSoftDeleteOffer();
  const editable = offer ? canEditOffer(offer.status) : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateOfferValues>({
    resolver: zodResolver(updateOfferSchema),
    values: offer
      ? {
          capacityKw: offer.capacityKw,
          pricePerKwh: Number(offer.pricePerKwh),
          deliveryStartLocal: toDateTimeLocalValue(offer.deliveryStart),
          deliveryEndLocal: toDateTimeLocalValue(offer.deliveryEnd),
        }
      : undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="Offer detail"
          description="Edit capacity, price, and delivery window when the API allows."
        />
        <Button variant="outline" size="sm" render={<Link href={basePath} />}>
          Back to offers
        </Button>
      </div>

      {detail.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : null}

      {detail.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(detail.error, "Could not load this offer.")}
        </p>
      ) : null}

      {offer ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>Capacity offer</CardTitle>
                <CardDescription>
                  Event {formatEventDate(offer.event?.scheduledStart)} →{" "}
                  {formatEventDate(offer.event?.scheduledEnd)}
                </CardDescription>
              </div>
              <OfferStatusBadge status={offer.status} />
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Capacity" value={`${offer.capacityKw} kW`} />
              <DetailItem
                label="Reserved"
                value={`${offer.reservedKw} kW`}
              />
              <DetailItem
                label="Price"
                value={`৳${String(offer.pricePerKwh)}/kWh`}
              />
              <DetailItem
                label="Delivery"
                value={`${formatEventDate(offer.deliveryStart)} → ${formatEventDate(offer.deliveryEnd)}`}
              />
            </CardContent>
          </Card>

          {editable ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Update offer</CardTitle>
                  <CardDescription>
                    Only AVAILABLE and PARTIALLY_AVAILABLE offers can be edited.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="grid gap-4"
                    noValidate
                    onSubmit={handleSubmit((values) => {
                      update.mutate(
                        {
                          capacityKw: values.capacityKw,
                          pricePerKwh: values.pricePerKwh,
                          deliveryStart: toApiDateTime(values.deliveryStartLocal),
                          deliveryEnd: toApiDateTime(values.deliveryEndLocal),
                        },
                        {
                          onSuccess: () => {
                            toast.add({
                              title: "Offer updated",
                              description: "Changes were saved.",
                              type: "success",
                            });
                          },
                          onError: (error) => {
                            toast.add({
                              title: "Could not update offer",
                              description: getApiErrorMessage(error, "Try again."),
                              type: "error",
                            });
                          },
                        },
                      );
                    })}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="capacityKw">Capacity (kW)</Label>
                      <Input
                        id="capacityKw"
                        type="number"
                        min={1}
                        step={1}
                        {...register("capacityKw")}
                      />
                      {errors.capacityKw ? (
                        <p className="text-sm text-destructive">
                          {errors.capacityKw.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pricePerKwh">Price per kWh (৳)</Label>
                      <Input
                        id="pricePerKwh"
                        type="number"
                        min={0.01}
                        step="0.01"
                        {...register("pricePerKwh")}
                      />
                      {errors.pricePerKwh ? (
                        <p className="text-sm text-destructive">
                          {errors.pricePerKwh.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryStartLocal">Delivery start</Label>
                      <Input
                        id="deliveryStartLocal"
                        type="datetime-local"
                        {...register("deliveryStartLocal")}
                      />
                      {errors.deliveryStartLocal ? (
                        <p className="text-sm text-destructive">
                          {errors.deliveryStartLocal.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryEndLocal">Delivery end</Label>
                      <Input
                        id="deliveryEndLocal"
                        type="datetime-local"
                        {...register("deliveryEndLocal")}
                      />
                      {errors.deliveryEndLocal ? (
                        <p className="text-sm text-destructive">
                          {errors.deliveryEndLocal.message}
                        </p>
                      ) : null}
                    </div>
                    <Button type="submit" disabled={update.isPending}>
                      {update.isPending ? "Saving…" : "Save changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cancel offer</CardTitle>
                  <CardDescription>
                    Soft-delete sets status to CANCELLED. The API rejects this
                    when active reservations block removal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={softDelete.isPending}
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Cancel this offer? It will be soft-deleted and marked CANCELLED.",
                      );
                      if (!confirmed) {
                        return;
                      }

                      softDelete.mutate(offer.id, {
                        onSuccess: () => {
                          toast.add({
                            title: "Offer cancelled",
                            description: "The offer was soft-deleted.",
                            type: "success",
                          });
                          router.push(basePath);
                        },
                        onError: (error) => {
                          toast.add({
                            title: "Could not cancel offer",
                            description: getApiErrorMessage(
                              error,
                              "Active reservations may block cancellation.",
                            ),
                            type: "error",
                          });
                        },
                      });
                    }}
                  >
                    {softDelete.isPending ? "Cancelling…" : "Cancel offer"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Update and cancel are only available while status is AVAILABLE or
              PARTIALLY_AVAILABLE.
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
