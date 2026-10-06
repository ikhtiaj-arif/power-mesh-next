export type PriorityTier =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "FLEXIBLE";

export type RequestStatus =
  | "PENDING"
  | "ALLOCATED"
  | "REJECTED"
  | "CANCELLED"
  | "FULFILLED";

export type CapacityRequest = {
  id: string;
  consumerId: string;
  eventId: string;
  requestedKw: number;
  maxPricePerKwh: string | number;
  priorityTier: PriorityTier;
  status: RequestStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  event?: {
    id: string;
    scheduledStart: string;
    scheduledEnd: string;
    status: string;
    totalCapacityKw: number;
    notes: string | null;
  };
};

export type RequestListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: RequestStatus;
  priorityTier?: PriorityTier;
  searchTerm?: string;
};

export type CreateRequestPayload = {
  eventId: string;
  requestedKw: number;
  maxPricePerKwh: number;
  priorityTier: PriorityTier;
};

export type UpdateRequestPayload = {
  requestedKw?: number;
  maxPricePerKwh?: number;
  priorityTier?: PriorityTier;
};

export const PRIORITY_TIERS: PriorityTier[] = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "FLEXIBLE",
];
