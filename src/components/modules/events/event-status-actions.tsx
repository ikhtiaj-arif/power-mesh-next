"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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
          <CardTitle>Status transitions</CardTitle>
          <CardDescription>
            Only legal next statuses from the API are offered.
            {event.status === "IN_PROGRESS" || event.status === "COMPLETED"
              ? " Moving to IN_PROGRESS or COMPLETED can set actual start/end on the server."
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {nextStatuses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This status is terminal. No further transitions are available.
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
            <CardTitle>Soft delete</CardTitle>
            <CardDescription>
              Allowed only while SCHEDULED and when no active offers or
              pending/allocated requests block it. The API sets CANCELLED.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="destructive"
              disabled={softDelete.isPending}
              onClick={() => {
                const confirmed = window.confirm(
                  "Soft-delete this scheduled event? This cannot be undone from the UI.",
                );
                if (!confirmed) {
                  return;
                }

                softDelete.mutate(event.id, {
                  onSuccess: () => {
                    toast.add({
                      title: "Event deleted",
                      description: "Event was soft-deleted and cancelled.",
                      type: "success",
                    });
                    router.push(basePath);
                  },
                  onError: (error) => {
                    toast.add({
                      title: "Could not delete event",
                      description: getApiErrorMessage(error, "Try again."),
                      type: "error",
                    });
                  },
                });
              }}
            >
              {softDelete.isPending ? "Deleting…" : "Soft delete event"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
