"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  formatEventDate,
  toApiDateTime,
  toDateTimeLocalValue,
} from "@/components/modules/events/event-datetime";
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
import { useCreateOffer, useGetAvailableEvents, useGetMe } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  createOfferSchema,
  type CreateOfferValues,
} from "@/validation/offer";

function providerGateMessage(status: string | undefined): string | undefined {
  switch (status) {
    case "APPROVED":
      return undefined;
    case "PENDING_EMAIL_VERIFICATION":
      return "Verify your provider email before publishing offers. The API rejects create until your profile is approved.";
    case "PENDING_APPROVAL":
      return "Your provider application is awaiting operator approval. You cannot create offers until status is APPROVED.";
    case "REJECTED":
      return "Your provider application was rejected. Contact support or re-apply before creating offers.";
    default:
      return "Provider approval is required before creating offers.";
  }
}

export function CreateOfferForm({ basePath }: { basePath: string }) {
  const router = useRouter();
  const me = useGetMe();
  const provider = me.data?.data.provider;
  const disabledReason = providerGateMessage(provider?.status);
  const maxCapacityKw = provider?.capacityKw;

  const events = useGetAvailableEvents({ page: 1, limit: 50 });
  const eventRows = events.data?.data ?? [];
  const create = useCreateOffer();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateOfferValues>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      eventId: "",
      capacityKw: 10,
      pricePerKwh: 12,
      deliveryStartLocal: "",
      deliveryEndLocal: "",
    },
  });

  const selectedEventId = watch("eventId");
  const selectedEvent = eventRows.find((event) => event.id === selectedEventId);

  useEffect(() => {
    if (!selectedEvent) {
      return;
    }
    setValue("deliveryStartLocal", toDateTimeLocalValue(selectedEvent.scheduledStart));
    setValue("deliveryEndLocal", toDateTimeLocalValue(selectedEvent.scheduledEnd));
  }, [selectedEvent, setValue]);

  if (me.isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  if (disabledReason) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create offer</CardTitle>
          <CardDescription>{disabledReason}</CardDescription>
        </CardHeader>
        {provider?.status === "REJECTED" && provider.rejectionReason ? (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Rejection reason:{" "}
              <span className="font-medium text-foreground">
                {provider.rejectionReason}
              </span>
            </p>
          </CardContent>
        ) : null}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create offer</CardTitle>
        <CardDescription>
          Bind capacity to an available event. Your registered maximum is{" "}
          {maxCapacityKw != null ? `${maxCapacityKw} kW` : "set on your provider profile"}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid max-w-xl gap-4"
          noValidate
          onSubmit={handleSubmit((values) => {
            create.mutate(
              {
                eventId: values.eventId,
                capacityKw: values.capacityKw,
                pricePerKwh: values.pricePerKwh,
                deliveryStart: toApiDateTime(values.deliveryStartLocal),
                deliveryEnd: toApiDateTime(values.deliveryEndLocal),
              },
              {
                onSuccess: () => {
                  toast.add({
                    title: "Offer created",
                    description: "Your offer is AVAILABLE on the event.",
                    type: "success",
                  });
                  router.push(basePath);
                },
                onError: (error) => {
                  toast.add({
                    title: "Could not create offer",
                    description: getApiErrorMessage(error, "Check capacity and delivery window."),
                    type: "error",
                  });
                },
              },
            );
          })}
        >
          <div className="space-y-2">
            <Label htmlFor="eventId">Event</Label>
            {events.isPending ? (
              <Skeleton className="h-8 w-full" />
            ) : events.isError ? (
              <p className="text-sm text-destructive" role="alert">
                {getApiErrorMessage(events.error, "Could not load available events.")}
              </p>
            ) : (
              <select
                id="eventId"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                aria-invalid={Boolean(errors.eventId)}
                {...register("eventId")}
              >
                <option value="">Select an event</option>
                {eventRows.map((event) => (
                  <option key={event.id} value={event.id}>
                    {formatEventDate(event.scheduledStart)} →{" "}
                    {formatEventDate(event.scheduledEnd)}
                    {event.notes ? ` — ${event.notes}` : ""}
                  </option>
                ))}
              </select>
            )}
            {errors.eventId ? (
              <p className="text-sm text-destructive">{errors.eventId.message}</p>
            ) : null}
            {eventRows.length === 0 && !events.isPending && !events.isError ? (
              <p className="text-sm text-muted-foreground">
                No available events right now.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacityKw">Capacity (kW)</Label>
            <Input
              id="capacityKw"
              type="number"
              min={1}
              max={maxCapacityKw ?? undefined}
              step={1}
              aria-invalid={Boolean(errors.capacityKw)}
              {...register("capacityKw")}
            />
            {errors.capacityKw ? (
              <p className="text-sm text-destructive">{errors.capacityKw.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerKwh">Price per kWh (৳)</Label>
            <Input
              id="pricePerKwh"
              type="number"
              min={0.01}
              step="0.01"
              aria-invalid={Boolean(errors.pricePerKwh)}
              {...register("pricePerKwh")}
            />
            {errors.pricePerKwh ? (
              <p className="text-sm text-destructive">{errors.pricePerKwh.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryStartLocal">Delivery start</Label>
            <Input
              id="deliveryStartLocal"
              type="datetime-local"
              aria-invalid={Boolean(errors.deliveryStartLocal)}
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
              aria-invalid={Boolean(errors.deliveryEndLocal)}
              {...register("deliveryEndLocal")}
            />
            {errors.deliveryEndLocal ? (
              <p className="text-sm text-destructive">
                {errors.deliveryEndLocal.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={
              create.isPending ||
              events.isPending ||
              eventRows.length === 0 ||
              Boolean(disabledReason)
            }
          >
            {create.isPending ? "Submitting…" : "Publish offer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
