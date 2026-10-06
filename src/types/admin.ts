import type { User, UserRole, UserStatus } from "./auth";
import type { PaymentStatus, Reservation, ReservationStatus } from "./reservation";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "SOFT_DELETE"
  | "RESERVE"
  | "ALLOCATE"
  | "PAY"
  | "REFUND"
  | "CONFIRM_DELIVERY"
  | "DISPUTE"
  | "RESOLVE";

export type DashboardStats = {
  users: { total: number; active: number; blocked: number };
  providers: { total: number; approved: number; pending: number };
  consumers: { total: number };
  events: { total: number; active: number };
  capacity: { offers: number; requests: number; pendingRequests: number };
  reservations: { total: number; completed: number; failed: number };
  payments: { total: number; completed: number; revenue: number | string };
  incidents: { open: number };
  refunds: { totalAmount: number | string };
};

export type AllocationPlanEntry = {
  offerId: string;
  requestId: string;
  consumerId: string;
  providerId: string;
  allocatedKw: number;
  unitPrice: number;
  totalAmount: number;
  deliveryStart: string;
  deliveryEnd: string;
};

export type AllocationSkipped = {
  requestId: string;
  reason: string;
};

export type AllocationPlan = {
  eventId: string;
  eventStatus: string;
  totalRequests: number;
  allocatedRequests: number;
  skipped: AllocationSkipped[];
  totalAllocatedKw: number;
  allocations: AllocationPlanEntry[];
};

export type AllocationPreviewResult = Omit<AllocationPlan, "allocations"> & {
  allocations: AllocationPlanEntry[];
};

export type ApproveAllocationResult = {
  eventId: string;
  eventStatus: string;
  totalRequests: number;
  allocatedRequests: number;
  skipped: AllocationSkipped[];
  totalAllocatedKw: number;
};

export type UpdateReservationStatusPayload = {
  status: ReservationStatus;
  paymentStatus?: PaymentStatus;
  resolution?: string;
};

export type AdminUserListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
};

export type AdminUser = User;

export type BlockUserPayload = {
  isBlocked: boolean;
  reason?: string;
};

export type AuditLogEntry = {
  id: string;
  userId: string | null;
  entityType: string;
  entityId: string;
  action: AuditAction;
  oldValues: unknown;
  newValues: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  } | null;
};

export type AuditLogListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  action?: AuditAction;
  entityType?: string;
  entityId?: string;
  userId?: string;
};

export type StaffReservationUpdate = Reservation & {
  payment?: {
    id: string;
    gatewayStatus: PaymentStatus;
    gatewayId?: string | null;
    bkashTrxId?: string | null;
  } | null;
};

export const AUDIT_ACTIONS: AuditAction[] = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "SOFT_DELETE",
  "RESERVE",
  "ALLOCATE",
  "PAY",
  "REFUND",
  "CONFIRM_DELIVERY",
  "DISPUTE",
  "RESOLVE",
];

export const RESERVATION_STATUS_OPTIONS: ReservationStatus[] = [
  "ALLOCATED",
  "PAYMENT_PENDING",
  "PAYMENT_COMPLETED",
  "DELIVERY_PENDING",
  "DELIVERY_CONFIRMED",
  "DELIVERY_PARTIAL",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
];
