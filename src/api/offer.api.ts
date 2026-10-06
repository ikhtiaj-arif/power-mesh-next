import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  CapacityOffer,
  CreateOfferPayload,
  OfferListParams,
  PaginatedApiResponse,
  PaginatedData,
  UpdateOfferPayload,
} from "@/types";

function withPageLimit(params: OfferListParams = {}) {
  const { page = 1, limit = 10, ...rest } = params;
  return {
    page,
    limit,
    ...Object.fromEntries(
      Object.entries(rest).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    ),
  };
}

export async function getOffersByEvent(
  eventId: string,
  params: OfferListParams = {},
): Promise<PaginatedData<CapacityOffer[]>> {
  const response = await apiClient<PaginatedApiResponse<CapacityOffer[]>>(
    `/offer/event/${eventId}`,
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getMyOffers(
  params: OfferListParams = {},
): Promise<PaginatedData<CapacityOffer[]>> {
  const response = await apiClient<PaginatedApiResponse<CapacityOffer[]>>(
    "/offer/my-offers",
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getOfferById(id: string): Promise<CapacityOffer> {
  const response = await apiClient<ApiResponse<CapacityOffer>>(`/offer/${id}`, {
    method: "GET",
  });
  return response.data;
}

export function createOffer(payload: CreateOfferPayload) {
  return apiClient<ApiResponse<CapacityOffer>>("/offer/create", {
    method: "POST",
    body: payload,
  });
}

export function updateOffer(id: string, payload: UpdateOfferPayload) {
  return apiClient<ApiResponse<CapacityOffer>>(`/offer/update/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function softDeleteOffer(id: string) {
  return apiClient<ApiResponse<CapacityOffer>>(`/offer/soft-delete/${id}`, {
    method: "PATCH",
  });
}
