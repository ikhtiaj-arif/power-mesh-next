export type OfferStatus =
  | "AVAILABLE"
  | "PARTIALLY_AVAILABLE"
  | "FULLY_ALLOCATED"
  | "EXPIRED"
  | "CANCELLED";

export type CapacityOffer = {
  id: string;
  providerId: string;
  eventId: string;
  capacityKw: number;
  pricePerKwh: string | number;
  deliveryStart: string;
  deliveryEnd: string;
  reservedKw: number;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  provider?: {
    id: string;
    companyName: string;
  };
  event?: {
    id: string;
    scheduledStart: string;
    scheduledEnd: string;
    status: string;
    totalCapacityKw: number;
    notes: string | null;
  };
};

export type CreateOfferPayload = {
  eventId: string;
  capacityKw: number;
  pricePerKwh: number;
  deliveryStart: string;
  deliveryEnd: string;
};

export type UpdateOfferPayload = {
  capacityKw?: number;
  pricePerKwh?: number;
  deliveryStart?: string;
  deliveryEnd?: string;
  status?: OfferStatus;
};

export type OfferListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: OfferStatus;
  eventId?: string;
  searchTerm?: string;
};
