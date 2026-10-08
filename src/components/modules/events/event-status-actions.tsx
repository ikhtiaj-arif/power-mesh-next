"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useSoftDeleteEvent, useUpdateEventStatus } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  EVENT_STATUS_TRANSITIONS,
  type OutageEvent,
  type OutageEventStatus,
} from "@/types";

export function EventStatusActions({
  event,
  basePath,
  canManage,
}: {
  event: OutageEvent;
  basePath: string;
  canManage: boolean;
}) {
  const router = useRouter();
  const updateStatus = useUpdateEventStatus(event.id);
  const softDelete = useSoftDeleteEvent();
  const nextStatuses = EVENT_STATUS_TRANSITIONS[event.status];
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!canManage) {
    return null;
  }

  function applyStatus(status: OutageEventStatus) {
    updateStatus.mutate(
      { status },
      {
        onSuccess: () => {
          toast.add({
            title: "Status updated",
            description: `Event is now ${status}.`,
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Could not update status",
            description: getApiErrorMessage(error, "Try again."),
            type: "error",
          });
        },
      },
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>
            Move this outage window to the next stage when the schedule is ready.
            {event.status === "IN_PROGRESS" || event.status === "COMPLETED"
              ? " Starting or completing can set the actual start and end times."
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {nextStatuses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This status is final. No further changes are available.
            </p>
          ) : (
            nextStatuses.map((status) => (
              <Button
                key={status}
                type="button"
                variant={status === "CANCELLED" ? "destructive" : "default"}
                disabled={updateStatus.isPending}
                onClick={() => applyStatus(status)}
              >
                Set {status}
              </Button>
            ))
          )}
        </CardContent>
      </Card>

      {event.status === "SCHEDULED" ? (
        <Card>
          <CardHeader>
            <CardTitle>Cancel event</CardTitle>
            <CardDescription>
              Only while scheduled, and only if there are no active offers or
              pending requests. The event will be cancelled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="destructive"
              disabled={softDelete.isPending}
              onClick={() => setDeleteOpen(true)}
            >
              {softDelete.isPending ? "Deleting…" : "Cancel event"}
            </Button>
            <ConfirmDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              title="Cancel this event?"
              description="This removes the scheduled outage window. You cannot undo it from here."
              confirmLabel="Cancel event"
              variant="destructive"
              loading={softDelete.isPending}
              onConfirm={() =>
                new Promise<void>((resolve, reject) => {
                  softDelete.mutate(event.id, {
                    onSuccess: () => {
                      toast.add({
                        title: "Event cancelled",
                        description: "The outage window was cancelled.",
                        type: "success",
                      });
                      router.push(basePath);
                      resolve();
                    },
                    onError: (error) => {
                      toast.add({
                        title: "Could not cancel event",
                        description: getApiErrorMessage(error, "Try again."),
                        type: "error",
                      });
                      reject(error);
                    },
                  });
                })
              }
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
