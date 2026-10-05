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
};

export type OfferListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: OfferStatus;
};
