"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ReservationStatusBadge } from "@/components/modules/reservations/reservation-status-badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useUpdateReservationStatus } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { PaymentStatus, Reservation, ReservationStatus } from "@/types";
import { PAYMENT_GATEWAY_STATUSES, RESERVATION_STATUS_OPTIONS } from "@/types";
import {
  updateReservationStatusSchema,
  type UpdateReservationStatusValues,
} from "@/validation/admin";

export function ReservationStatusOverride({ reservation }: { reservation: Reservation }) {
  const update = useUpdateReservationStatus(reservation.id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<UpdateReservationStatusValues | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateReservationStatusValues>({
    resolver: zodResolver(updateReservationStatusSchema),
    defaultValues: {
      status: reservation.status,
      paymentStatus: (reservation.paymentStatus ?? "") as PaymentStatus | "",
      resolution: "",
    },
  });

  function applyUpdate(values: UpdateReservationStatusValues) {
    return new Promise<void>((resolve, reject) => {
      update.mutate(
        {
          status: values.status as ReservationStatus,
          ...(values.paymentStatus
            ? { paymentStatus: values.paymentStatus as PaymentStatus }
            : {}),
          ...(values.resolution?.trim()
            ? { resolution: values.resolution.trim() }
            : {}),
        },
        {
          onSuccess: (response) => {
            const payment = response.data.payment;
            toast.add({
              title: "Reservation updated",
              description: payment
                ? `Status ${response.data.status}. Payment: ${payment.gatewayStatus}.`
                : `Status is now ${response.data.status}.`,
              type: "success",
            });
            resolve();
          },
          onError: (error) => {
            toast.add({
              title: "Update failed",
              description: getApiErrorMessage(error, "Could not update reservation."),
              type: "error",
            });
            reject(error);
          },
        },
      );
    });
  }

  return (
    <>
      <form
        className="space-y-3 rounded-lg border p-4"
        noValidate
        onSubmit={handleSubmit((values) => {
          setPendingValues(values);
          setConfirmOpen(true);
        })}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              {reservation.id.slice(0, 8)}…
            </p>
            <p className="text-sm">
              {reservation.allocatedKw} kW ·{" "}
              <ReservationStatusBadge status={reservation.status} />
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor={`status-${reservation.id}`}>Reservation status</Label>
            <select
              id={`status-${reservation.id}`}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("status")}
            >
              {RESERVATION_STATUS_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            {errors.status ? (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Label htmlFor={`payment-${reservation.id}`}>Payment status</Label>
            <select
              id={`payment-${reservation.id}`}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("paymentStatus")}
            >
              <option value="">Leave unchanged</option>
              {PAYMENT_GATEWAY_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            {errors.paymentStatus ? (
              <p className="text-sm text-destructive">
                {errors.paymentStatus.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Label htmlFor={`resolution-${reservation.id}`}>Resolution note</Label>
            <Input
              id={`resolution-${reservation.id}`}
              maxLength={1000}
              placeholder="Optional note"
              {...register("resolution")}
            />
            {errors.resolution ? (
              <p className="text-sm text-destructive">
                {errors.resolution.message}
              </p>
            ) : null}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Failed or refunded statuses may trigger a refund. Cancelled releases
          offer capacity only when there is no payment yet.
        </p>

        <Button type="submit" size="sm" disabled={update.isPending}>
          {update.isPending ? "Saving…" : "Update status"}
        </Button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Update reservation status?"
        description={
          pendingValues
            ? `Set this reservation to ${pendingValues.status}. This may release capacity, record refunds, or open incidents.`
            : "This may release capacity, record refunds, or open incidents."
        }
        confirmLabel="Update status"
        loading={update.isPending}
        onConfirm={async () => {
          if (!pendingValues) {
            return;
          }
          await applyUpdate(pendingValues);
          setPendingValues(null);
        }}
      />
    </>
  );
}
