import type { Reservation, ReservationStatus } from "./reservation";

export type DeliveryStatus =
  | "PENDING_CHECKIN"
  | "CONFIRMED"
  | "DISPUTED"
  | "RESOLVED"
  | "PARTIAL";

export type Delivery = {
  id: string;
  reservationId: string;
  confirmedByProvider: string | null;
  confirmedByConsumer: string | null;
  providerConfirmedAt: string | null;
  consumerConfirmedAt: string | null;
  actualDeliveredKw: number | null;
  partialRefundAmount: string | number | null;
  status: DeliveryStatus;
  disputeReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryReservationDetail = Reservation & {
  delivery: Delivery | null;
  offer?: Reservation["offer"] & {
    event?: {
      id: string;
      scheduledStart: string;
      scheduledEnd: string;
      status: string;
    };
  };
};

export type ProviderReportPayload = {
  actualDeliveredKw: number;
};

export type ConsumerDisputePayload = {
  disputeReason: string;
};

export type ConsumerConfirmResult = {
  reservationId: string;
  fullDelivery: boolean;
  partialDelivery: boolean;
};

export const DELIVERY_WINDOW_RESERVATION_STATUSES: ReservationStatus[] = [
  "PAYMENT_COMPLETED",
  "DELIVERY_PENDING",
];

export const PROVIDER_DELIVERY_LIST_STATUSES: ReservationStatus[] = [
  "PAYMENT_COMPLETED",
  "DELIVERY_PENDING",
  "DELIVERY_CONFIRMED",
  "DELIVERY_PARTIAL",
];

export const PAYABLE_RESERVATION_STATUSES: ReservationStatus[] = [
  "ALLOCATED",
  "PAYMENT_PENDING",
];

export const CONSUMER_DELIVERY_LINK_STATUSES: ReservationStatus[] = [
  "PAYMENT_COMPLETED",
  "DELIVERY_PENDING",
  "DELIVERY_CONFIRMED",
  "DELIVERY_PARTIAL",
];
