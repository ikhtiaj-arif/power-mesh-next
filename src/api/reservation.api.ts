import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  CreateReservationPayload,
  PaginatedApiResponse,
  PaginatedData,
  Reservation,
  ReservationListParams,
} from "@/types";

function withPageLimit(params: ReservationListParams = {}) {
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

export async function getMyReservations(
  params: ReservationListParams = {},
): Promise<PaginatedData<Reservation[]>> {
  const response = await apiClient<PaginatedApiResponse<Reservation[]>>(
    "/reservation/my-reservations",
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getAllReservations(
  params: ReservationListParams = {},
): Promise<PaginatedData<Reservation[]>> {
  const response = await apiClient<PaginatedApiResponse<Reservation[]>>(
    "/reservation/all",
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getProviderReservations(
  providerId: string,
  params: ReservationListParams = {},
): Promise<PaginatedData<Reservation[]>> {
  const response = await apiClient<PaginatedApiResponse<Reservation[]>>(
    `/reservation/provider/${providerId}`,
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getReservationById(id: string): Promise<Reservation> {
  const response = await apiClient<ApiResponse<Reservation>>(
    `/reservation/${id}`,
    { method: "GET" },
  );
  return response.data;
}

export function createReservation(payload: CreateReservationPayload) {
  return apiClient<ApiResponse<Reservation>>("/reservation/create", {
    method: "POST",
    body: payload,
  });
}

export function cancelReservation(id: string) {
  return apiClient<ApiResponse<Reservation>>(`/reservation/cancel/${id}`, {
    method: "PATCH",
  });
}
