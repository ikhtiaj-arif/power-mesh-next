"use client";

import Link from "next/link";
import { useState } from "react";

import { CreateRequestForm } from "@/components/modules/requests/create-request-form";
import { RequestStatusBadge } from "@/components/modules/requests/request-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useGetMyRequests } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";

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
  const [open, setOpen] = useState(false);
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
              You already have a request for this event. Cancelled or rejected
              rows still count toward the one-request-per-event rule.
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Request capacity</CardTitle>
          <CardDescription>
            {canCreate
              ? "Tell us how many kilowatts you need and your max price."
              : `Requests are only allowed while the event is scheduled or confirmed (current: ${eventStatus}).`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="sm"
            disabled={!canCreate}
            onClick={() => setOpen(true)}
          >
            Request kilowatts
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request capacity</DialogTitle>
            <DialogDescription>
              One request per consumer per event.
            </DialogDescription>
          </DialogHeader>
          <CreateRequestForm
            eventId={eventId}
            onSuccess={() => setOpen(false)}
            embedded
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
