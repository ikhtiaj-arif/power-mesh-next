"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { toApiDateTime } from "@/components/modules/events/event-datetime";
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
import { useCreateEvent } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  createEventSchema,
  type CreateEventValues,
} from "@/validation/event";
import { cn } from "@/lib/utils";

export function CreateEventForm({ basePath }: { basePath: string }) {
  const router = useRouter();
  const create = useCreateEvent();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      scheduledStart: "",
      scheduledEnd: "",
      totalCapacityKw: 100,
      survivalQuotaKw: 20,
      notes: "",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="Create event"
          description="Schedule a new outage window. Initial status becomes SCHEDULED."
        />
        <Button variant="outline" size="sm" render={<Link href={basePath} />}>
          Back to events
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
          <CardDescription>
            Survival quota is stored by the API and is not applied by the
            allocator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid max-w-xl gap-4"
            noValidate
            onSubmit={handleSubmit((values) => {
              create.mutate(
                {
                  scheduledStart: toApiDateTime(values.scheduledStart),
                  scheduledEnd: toApiDateTime(values.scheduledEnd),
                  totalCapacityKw: values.totalCapacityKw,
                  survivalQuotaKw: values.survivalQuotaKw,
                  notes: values.notes?.trim() ? values.notes.trim() : undefined,
                },
                {
                  onSuccess: (response) => {
                    toast.add({
                      title: "Event created",
                      description: "Status is SCHEDULED.",
                      type: "success",
                    });
                    router.push(`${basePath}/${response.data.id}`);
                  },
                  onError: (error) => {
                    toast.add({
                      title: "Could not create event",
                      description: getApiErrorMessage(error, "Try again."),
                      type: "error",
                    });
                  },
                },
              );
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="scheduledStart">Scheduled start</Label>
              <Input
                id="scheduledStart"
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
              <Label htmlFor="scheduledEnd">Scheduled end</Label>
              <Input
                id="scheduledEnd"
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

            <div className="space-y-2">
              <Label htmlFor="totalCapacityKw">Total capacity (kW)</Label>
              <Input
                id="totalCapacityKw"
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
              <Label htmlFor="survivalQuotaKw">Survival quota (kW)</Label>
              <Input
                id="survivalQuotaKw"
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

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={3}
                className={cn(
                  "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                )}
                {...register("notes")}
              />
              {errors.notes ? (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              ) : null}
            </div>

            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Creating…" : "Create event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
