export type OutageEventStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type EventCounts = {
  capacityOffers?: number;
  capacityRequests?: number;
};

export type OutageEvent = {
  id: string;
  operatorId: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  totalCapacityKw: number;
  survivalQuotaKw: number;
  allocatedKw: number;
  status: OutageEventStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count?: EventCounts;
  operator?: {
    id: string;
    userId: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
};

export type EventListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  status?: OutageEventStatus;
  startDate?: string;
  endDate?: string;
  minCapacity?: number;
  maxCapacity?: number;
};

export type CreateEventPayload = {
  scheduledStart: string;
  scheduledEnd: string;
  totalCapacityKw: number;
  survivalQuotaKw: number;
  notes?: string;
};

export type UpdateEventPayload = {
  scheduledStart?: string;
  scheduledEnd?: string;
  totalCapacityKw?: number;
  survivalQuotaKw?: number;
  notes?: string;
  actualStart?: string;
  actualEnd?: string;
};

export type UpdateEventStatusPayload = {
  status: OutageEventStatus;
};

export const EVENT_STATUS_TRANSITIONS: Record<
  OutageEventStatus,
  OutageEventStatus[]
> = {
  SCHEDULED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};
