"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  toApiDateTime,
  toDateTimeLocalValue,
  isEventScheduleEditable,
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
import { toast } from "@/components/ui/toast";
import { useUpdateEvent } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { OutageEvent } from "@/types";
import {
  updateEventSchema,
  type UpdateEventValues,
} from "@/validation/event";
import { cn } from "@/lib/utils";

export function UpdateEventForm({ event }: { event: OutageEvent }) {
  const update = useUpdateEvent(event.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateEventValues>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      scheduledStart: toDateTimeLocalValue(event.scheduledStart),
      scheduledEnd: toDateTimeLocalValue(event.scheduledEnd),
      totalCapacityKw: event.totalCapacityKw,
      survivalQuotaKw: event.survivalQuotaKw,
      notes: event.notes ?? "",
    },
  });

  if (!isEventScheduleEditable(event)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit event</CardTitle>
        <CardDescription>
          Only upcoming SCHEDULED events can be updated. Past or in-progress
          windows are locked.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          noValidate
          onSubmit={handleSubmit((values) => {
            update.mutate(
              {
                scheduledStart: toApiDateTime(values.scheduledStart),
                scheduledEnd: toApiDateTime(values.scheduledEnd),
                totalCapacityKw: values.totalCapacityKw,
                survivalQuotaKw: values.survivalQuotaKw,
                notes: values.notes?.trim() ? values.notes.trim() : undefined,
              },
              {
                onSuccess: () => {
                  toast.add({
                    title: "Event updated",
                    description: "Schedule and capacity saved.",
                    type: "success",
                  });
                },
                onError: (error) => {
                  toast.add({
                    title: "Could not update event",
                    description: getApiErrorMessage(error, "Try again."),
                    type: "error",
                  });
                },
              },
            );
          })}
        >
          <div className="space-y-2">
            <Label htmlFor={`start-${event.id}`}>Scheduled start</Label>
            <Input
              id={`start-${event.id}`}
              type="datetime-local"
              aria-invalid={Boolean(errors.scheduledStart)}
              {...register("scheduledStart")}
            />
            {errors.scheduledStart ? (
              <p className="text-sm text-destructive">
                {errors.scheduledStart.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`end-${event.id}`}>Scheduled end</Label>
            <Input
              id={`end-${event.id}`}
              type="datetime-local"
              aria-invalid={Boolean(errors.scheduledEnd)}
              {...register("scheduledEnd")}
            />
            {errors.scheduledEnd ? (
              <p className="text-sm text-destructive">
                {errors.scheduledEnd.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`capacity-${event.id}`}>Total capacity (kW)</Label>
              <Input
                id={`capacity-${event.id}`}
                type="number"
                min={1}
                step={1}
                aria-invalid={Boolean(errors.totalCapacityKw)}
                {...register("totalCapacityKw")}
              />
              {errors.totalCapacityKw ? (
                <p className="text-sm text-destructive">
                  {errors.totalCapacityKw.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`quota-${event.id}`}>Survival quota (kW)</Label>
              <Input
                id={`quota-${event.id}`}
                type="number"
                min={1}
                step={1}
                aria-invalid={Boolean(errors.survivalQuotaKw)}
                {...register("survivalQuotaKw")}
              />
              {errors.survivalQuotaKw ? (
                <p className="text-sm text-destructive">
                  {errors.survivalQuotaKw.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`notes-${event.id}`}>Notes</Label>
            <textarea
              id={`notes-${event.id}`}
              rows={3}
              className={cn(
                "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
              {...register("notes")}
            />
          </div>

          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
