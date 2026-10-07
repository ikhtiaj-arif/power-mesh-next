import type { PaymentStatus } from "./reservation";

export type PaymentMethod =
  | "CASH_OUT"
  | "SEND_MONEY"
  | "BKASH"
  | "STRIPE"
  | "UNKNOWN";

export type PaymentProvider = "BKASH" | "STRIPE";

export type WebhookStatus = "PENDING" | "RECEIVED" | "PROCESSED" | "FAILED";

export type PaymentRecord = {
  id: string;
  reservationId: string;
  gatewayId: string | null;
  gatewayStatus: PaymentStatus;
  amount: string | number;
  currency: string;
  paymentMethod: PaymentMethod;
  merchantInvoiceNumber: string;
  payerReference?: string | null;
  bkashTrxId: string | null;
  paidAt: string | null;
  initiatedAt?: string;
  completedAt: string | null;
  webhookStatus?: WebhookStatus;
  createdAt: string;
  updatedAt: string;
  reservation?: {
    id: string;
    allocatedKw?: number;
    status: string;
    totalAmount?: string | number;
    consumer?: {
      user?: { email: string; firstName: string; lastName: string };
    };
    provider?: {
      id?: string;
      companyName?: string;
      user?: { email: string; firstName: string; lastName: string };
    };
    offer?: {
      event?: {
        id: string;
        scheduledStart: string;
        scheduledEnd: string;
      };
      provider?: {
        id: string;
        companyName: string;
      };
    };
  };
};

/** Alias used by consumer payment modules. */
export type Payment = PaymentRecord;

export type GatewayPaymentStatus = PaymentStatus;

export type InitiatePaymentPayload = {
  reservationId: string;
  provider: PaymentProvider;
};

export type InitiatePaymentResult = {
  payment: PaymentRecord;
  provider: PaymentProvider;
  checkoutURL: string;
  /** Present for bKash (legacy alias of checkoutURL). */
  bkashURL?: string;
  paymentID?: string;
  sessionId?: string;
};

export type PaymentListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  gatewayStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  webhookStatus?: WebhookStatus;
  consumerEmail?: string;
  reservationId?: string;
};

export const PAYMENT_GATEWAY_STATUSES: PaymentStatus[] = [
  "INITIATED",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
];

export const PAYMENT_PROVIDERS: PaymentProvider[] = ["BKASH", "STRIPE"];
