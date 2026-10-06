import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  CapacityRequest,
  CreateRequestPayload,
  PaginatedApiResponse,
  PaginatedData,
  RequestListParams,
  UpdateRequestPayload,
} from "@/types";

function withPageLimit(params: RequestListParams = {}) {
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

export async function getMyRequests(
  params: RequestListParams = {},
): Promise<PaginatedData<CapacityRequest[]>> {
  const response = await apiClient<PaginatedApiResponse<CapacityRequest[]>>(
    "/request/my-requests",
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getAllRequests(
  params: RequestListParams = {},
): Promise<PaginatedData<CapacityRequest[]>> {
  const response = await apiClient<PaginatedApiResponse<CapacityRequest[]>>(
    "/request/all",
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getRequestsByEvent(
  eventId: string,
  params: RequestListParams = {},
): Promise<PaginatedData<CapacityRequest[]>> {
  const response = await apiClient<PaginatedApiResponse<CapacityRequest[]>>(
    `/request/event/${eventId}`,
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getRequestById(id: string): Promise<CapacityRequest> {
  const response = await apiClient<ApiResponse<CapacityRequest>>(
    `/request/${id}`,
    { method: "GET" },
  );
  return response.data;
}

export function createRequest(payload: CreateRequestPayload) {
  return apiClient<ApiResponse<CapacityRequest>>("/request/create", {
    method: "POST",
    body: payload,
  });
}

export function updateRequest(id: string, payload: UpdateRequestPayload) {
  return apiClient<ApiResponse<CapacityRequest>>(`/request/update/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function cancelRequest(id: string) {
  return apiClient<ApiResponse<CapacityRequest>>(`/request/cancel/${id}`, {
    method: "PATCH",
  });
}

export function softDeleteRequest(id: string) {
  return apiClient<ApiResponse<CapacityRequest>>(`/request/soft-delete/${id}`, {
    method: "PATCH",
  });
}
