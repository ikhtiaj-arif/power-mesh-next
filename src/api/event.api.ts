import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  CreateEventPayload,
  EventListParams,
  OutageEvent,
  PaginatedApiResponse,
  PaginatedData,
  UpdateEventPayload,
  UpdateEventStatusPayload,
} from "@/types";

function withPageLimit(params: EventListParams = {}) {
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

export async function getAvailableEvents(
  params: EventListParams = {},
): Promise<PaginatedData<OutageEvent[]>> {
  const response = await apiClient<PaginatedApiResponse<OutageEvent[]>>(
    "/event/available",
    {
      method: "GET",
      params: withPageLimit({
        sortBy: "scheduledStart",
        sortOrder: "asc",
        ...params,
      }),
    },
  );

  return { data: response.data, meta: response.meta };
}

export async function getMyEvents(
  params: EventListParams = {},
): Promise<PaginatedData<OutageEvent[]>> {
  const response = await apiClient<PaginatedApiResponse<OutageEvent[]>>(
    "/event/my-events",
    {
      method: "GET",
      params: withPageLimit(params),
    },
  );

  return { data: response.data, meta: response.meta };
}

export async function getAllEvents(
  params: EventListParams = {},
): Promise<PaginatedData<OutageEvent[]>> {
  const response = await apiClient<PaginatedApiResponse<OutageEvent[]>>(
    "/event/all",
    {
      method: "GET",
      params: withPageLimit(params),
    },
  );

  return { data: response.data, meta: response.meta };
}

export async function getEventById(id: string): Promise<OutageEvent> {
  const response = await apiClient<ApiResponse<OutageEvent>>(`/event/${id}`, {
    method: "GET",
  });
  return response.data;
}

export function createEvent(payload: CreateEventPayload) {
  return apiClient<ApiResponse<OutageEvent>>("/event/create", {
    method: "POST",
    body: payload,
  });
}

export function updateEvent(id: string, payload: UpdateEventPayload) {
  return apiClient<ApiResponse<OutageEvent>>(`/event/update/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateEventStatus(id: string, payload: UpdateEventStatusPayload) {
  return apiClient<ApiResponse<OutageEvent>>(`/event/status/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function softDeleteEvent(id: string) {
  return apiClient<ApiResponse<OutageEvent>>(`/event/soft-delete/${id}`, {
    method: "PATCH",
  });
}
