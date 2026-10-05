import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  CapacityOffer,
  OfferListParams,
  PaginatedApiResponse,
  PaginatedData,
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
