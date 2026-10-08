"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { toast } from "@/components/ui/toast";
import { useCreateRequest } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { PRIORITY_TIERS } from "@/types";
import {
  createRequestSchema,
  type CreateRequestValues,
} from "@/validation/request";

export function CreateRequestForm({
  eventId,
  disabledReason,
  embedded = false,
  onSuccess,
}: {
  eventId: string;
  disabledReason?: string;
  embedded?: boolean;
  onSuccess?: () => void;
}) {
  const create = useCreateRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRequestValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      requestedKw: 10,
      maxPricePerKwh: 12,
      priorityTier: "MEDIUM",
    },
  });

  const form = (
    <form
      className="grid max-w-xl gap-4"
      noValidate
      onSubmit={handleSubmit((values) => {
        create.mutate(
          {
            eventId,
            requestedKw: values.requestedKw,
            maxPricePerKwh: values.maxPricePerKwh,
            priorityTier: values.priorityTier,
          },
          {
            onSuccess: () => {
              toast.add({
                title: "Request created",
                description: "Your capacity request is pending.",
                type: "success",
              });
              onSuccess?.();
            },
            onError: (error) => {
              toast.add({
                title: "Could not create request",
                description: getApiErrorMessage(
                  error,
                  "You may already have a request for this event.",
                ),
                type: "error",
              });
            },
          },
        );
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="requestedKw">Requested kW</Label>
        <Input
          id="requestedKw"
          type="number"
          min={1}
          step={1}
          aria-invalid={Boolean(errors.requestedKw)}
          {...register("requestedKw")}
        />
        {errors.requestedKw ? (
          <p className="text-sm text-destructive">
            {errors.requestedKw.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxPricePerKwh">Max price per kWh (৳)</Label>
        <Input
          id="maxPricePerKwh"
          type="number"
          min={0.01}
          step="0.01"
          aria-invalid={Boolean(errors.maxPricePerKwh)}
          {...register("maxPricePerKwh")}
        />
        {errors.maxPricePerKwh ? (
          <p className="text-sm text-destructive">
            {errors.maxPricePerKwh.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priorityTier">Priority tier</Label>
        <select
          id="priorityTier"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          aria-invalid={Boolean(errors.priorityTier)}
          {...register("priorityTier")}
        >
          {PRIORITY_TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>
        {errors.priorityTier ? (
          <p className="text-sm text-destructive">
            {errors.priorityTier.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={create.isPending}>
        {create.isPending ? "Submitting…" : "Submit request"}
      </Button>
    </form>
  );

  if (disabledReason) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request capacity</CardTitle>
          <CardDescription>{disabledReason}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (embedded) {
    return form;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request capacity</CardTitle>
        <CardDescription>
          One request per consumer per event. Cancelled rows still occupy that
          unique pair, so you cannot re-apply for the same event.
        </CardDescription>
      </CardHeader>
      <CardContent>{form}</CardContent>
    </Card>
  );
}
