"use client";

import { useState } from "react";

import { ReservationStatusBadge } from "@/components/modules/reservations/reservation-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useUpdateReservationStatus } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { PaymentStatus, Reservation, ReservationStatus } from "@/types";
import { PAYMENT_GATEWAY_STATUSES, RESERVATION_STATUS_OPTIONS } from "@/types";

export function ReservationStatusOverride({ reservation }: { reservation: Reservation }) {
  const [status, setStatus] = useState<ReservationStatus>(reservation.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">(
    reservation.paymentStatus ?? "",
  );
  const [resolution, setResolution] = useState("");

  const update = useUpdateReservationStatus(reservation.id);

  function submit() {
    const confirmed = window.confirm(
      `Set reservation ${reservation.id.slice(0, 8)}… to ${status}? This may release capacity, record refunds, or open incidents depending on the status.`,
    );
    if (!confirmed) {
      return;
    }

    update.mutate(
      {
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(resolution.trim() ? { resolution: resolution.trim() } : {}),
      },
      {
        onSuccess: (response) => {
          const payment = response.data.payment;
          toast.add({
            title: "Reservation updated",
            description: payment
              ? `Status ${response.data.status}. Payment gateway: ${payment.gatewayStatus}.`
              : `Status is now ${response.data.status}.`,
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Update failed",
            description: getApiErrorMessage(error, "Could not update reservation."),
            type: "error",
          });
        },
      },
    );
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{reservation.id}</p>
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
            value={status}
            onChange={(e) => setStatus(e.target.value as ReservationStatus)}
          >
            {RESERVATION_STATUS_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`payment-${reservation.id}`}>Payment status (optional)</Label>
          <select
            id={`payment-${reservation.id}`}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus | "")}
          >
            <option value="">Leave unchanged</option>
            {PAYMENT_GATEWAY_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1 sm:col-span-1">
          <Label htmlFor={`resolution-${reservation.id}`}>Resolution note</Label>
          <Input
            id={`resolution-${reservation.id}`}
            value={resolution}
            maxLength={1000}
            placeholder="Optional (max 1000 chars)"
            onChange={(e) => setResolution(e.target.value)}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        FAILED or REFUNDED attempts a bKash refund when gateway payment and trx IDs exist; a local
        refund record is still written if the gateway call fails. CANCELLED releases offer capacity
        only when no payment row exists.
      </p>

      <Button type="button" size="sm" disabled={update.isPending} onClick={submit}>
        {update.isPending ? "Saving…" : "Update status"}
      </Button>
    </div>
  );
}
