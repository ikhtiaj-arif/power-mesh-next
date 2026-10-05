export type ReservationStatus =
  | "ALLOCATED"
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "DELIVERY_PENDING"
  | "DELIVERY_CONFIRMED"
  | "DELIVERY_PARTIAL"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export type PaymentStatus =
  | "INITIATED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export type Reservation = {
  id: string;
  offerId: string;
  requestId: string;
  consumerId: string;
  providerId: string;
  allocatedKw: number;
  unitPrice: string | number;
  totalAmount: string | number;
  deliveryStart: string;
  deliveryEnd: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  offer?: {
    id: string;
    capacityKw: number;
    reservedKw: number;
    pricePerKwh: string | number;
    status: string;
    event?: {
      id: string;
      scheduledStart: string;
      scheduledEnd: string;
      status: string;
    };
    provider?: {
      id: string;
      companyName: string;
    };
  };
  request?: {
    id: string;
    requestedKw: number;
    status: string;
  };
};

export type ReservationListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: ReservationStatus;
};

export type CreateReservationPayload = {
  offerId: string;
  requestId: string;
};

export const CANCELABLE_RESERVATION_STATUSES: ReservationStatus[] = [
  "ALLOCATED",
  "PAYMENT_PENDING",
];
