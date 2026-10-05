"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { RequestStatusBadge } from "@/components/modules/requests/request-status-badge";
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
  useCancelRequest,
  useGetRequestById,
  useUpdateRequest,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { PRIORITY_TIERS } from "@/types";
import {
  updateRequestSchema,
  type UpdateRequestValues,
} from "@/validation/request";

export function RequestDetail({
  requestId,
  basePath,
}: {
  requestId: string;
  basePath: string;
}) {
  const router = useRouter();
  const detail = useGetRequestById(requestId);
  const request = detail.data;
  const update = useUpdateRequest(requestId);
  const cancel = useCancelRequest();
  const canEdit = request?.status === "PENDING";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateRequestValues>({
    resolver: zodResolver(updateRequestSchema),
    values: request
      ? {
          requestedKw: request.requestedKw,
          maxPricePerKwh: Number(request.maxPricePerKwh),
          priorityTier: request.priorityTier,
        }
      : undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="Request detail"
          description="Review, update, or cancel your pending capacity request."
        />
        <Button variant="outline" size="sm" render={<Link href={basePath} />}>
          Back to requests
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
          {getApiErrorMessage(detail.error, "Could not load this request.")}
        </p>
      ) : null}

      {request ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>Capacity request</CardTitle>
                <CardDescription>
                  Event {formatEventDate(request.event?.scheduledStart)} →{" "}
                  {formatEventDate(request.event?.scheduledEnd)}
                </CardDescription>
              </div>
              <RequestStatusBadge status={request.status} />
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Requested" value={`${request.requestedKw} kW`} />
              <DetailItem
                label="Max price"
                value={`৳${String(request.maxPricePerKwh)}/kWh`}
              />
              <DetailItem label="Priority" value={request.priorityTier} />
              <DetailItem
                label="Rejection reason"
                value={request.rejectionReason ?? "None"}
              />
            </CardContent>
          </Card>

          {canEdit ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Update request</CardTitle>
                  <CardDescription>
                    Only PENDING requests can be edited.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="grid gap-4"
                    noValidate
                    onSubmit={handleSubmit((values) => {
                      update.mutate(values, {
                        onSuccess: () => {
                          toast.add({
                            title: "Request updated",
                            description: "Your pending request was saved.",
                            type: "success",
                          });
                        },
                        onError: (error) => {
                          toast.add({
                            title: "Could not update request",
                            description: getApiErrorMessage(error, "Try again."),
                            type: "error",
                          });
                        },
                      });
                    })}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="requestedKw">Requested kW</Label>
                      <Input
                        id="requestedKw"
                        type="number"
                        min={1}
                        step={1}
                        {...register("requestedKw")}
                      />
                      {errors.requestedKw ? (
                        <p className="text-sm text-destructive">
                          {errors.requestedKw.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxPricePerKwh">Max ৳/kWh</Label>
                      <Input
                        id="maxPricePerKwh"
                        type="number"
                        min={0.01}
                        step="0.01"
                        {...register("maxPricePerKwh")}
                      />
                      {errors.maxPricePerKwh ? (
                        <p className="text-sm text-destructive">
                          {errors.maxPricePerKwh.message}
                        </p>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priorityTier">Priority</Label>
                      <select
                        id="priorityTier"
                        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                        {...register("priorityTier")}
                      >
                        {PRIORITY_TIERS.map((tier) => (
                          <option key={tier} value={tier}>
                            {tier}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button type="submit" disabled={update.isPending}>
                      {update.isPending ? "Saving…" : "Save changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cancel request</CardTitle>
                  <CardDescription>
                    Cancel sets CANCELLED and does not free the consumer/event
                    unique pair, so you cannot create another request for this
                    event.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={cancel.isPending}
                    onClick={() => {
                      cancel.mutate(request.id, {
                        onSuccess: () => {
                          toast.add({
                            title: "Request cancelled",
                            description:
                              "Status is CANCELLED. A new request for this event is not available.",
                            type: "success",
                          });
                          router.push(basePath);
                        },
                        onError: (error) => {
                          toast.add({
                            title: "Could not cancel request",
                            description: getApiErrorMessage(error, "Try again."),
                            type: "error",
                          });
                        },
                      });
                    }}
                  >
                    {cancel.isPending ? "Cancelling…" : "Cancel request"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Update and cancel are only available while status is PENDING.
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
