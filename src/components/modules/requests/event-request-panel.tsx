"use client";

import { CreateRequestForm } from "@/components/modules/requests/create-request-form";
import { RequestStatusBadge } from "@/components/modules/requests/request-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useGetMyRequests } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EventRequestPanel({
  eventId,
  eventStatus,
}: {
  eventId: string;
  eventStatus: string;
}) {
  const me = useGetMe();
  const role = me.data?.data.role;
  const myRequests = useGetMyRequests({ page: 1, limit: 50 });
  const existing = myRequests.data?.data.find(
    (request) => request.eventId === eventId,
  );

  if (role !== "CONSUMER") {
    return null;
  }

  if (myRequests.isPending) {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  if (myRequests.isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {getApiErrorMessage(myRequests.error, "Could not check your requests.")}
      </p>
    );
  }

  if (existing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Your request</CardTitle>
            <CardDescription>
              {existing.requestedKw} kW · max ৳{String(existing.maxPricePerKwh)}
              /kWh · {existing.priorityTier}
            </CardDescription>
          </div>
          <RequestStatusBadge status={existing.status} />
        </CardHeader>
        <CardContent className="space-y-3">
          {existing.status === "CANCELLED" || existing.status === "REJECTED" ? (
            <p className="text-sm text-muted-foreground">
              This event already has a request row for your account. The API
              unique pair is not freed after cancel/reject, so you cannot create
              another request here.
            </p>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            render={<Link href={`/consumer/requests/${existing.id}`} />}
          >
            Open request
          </Button>
        </CardContent>
      </Card>
    );
  }

  const canCreate =
    eventStatus === "SCHEDULED" || eventStatus === "CONFIRMED";

  return (
    <CreateRequestForm
      eventId={eventId}
      disabledReason={
        canCreate
          ? undefined
          : `Requests are only allowed while the event is SCHEDULED or CONFIRMED (current: ${eventStatus}).`
      }
    />
  );
}
