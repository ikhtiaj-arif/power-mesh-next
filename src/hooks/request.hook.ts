import {
  cancelRequest,
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  getRequestsByEvent,
  softDeleteRequest,
  updateRequest,
} from "@/api";
import type { RequestListParams, UpdateRequestPayload } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const REQUESTS_QUERY_KEY = ["requests"] as const;

export function myRequestsKey(params: RequestListParams = {}) {
  return [...REQUESTS_QUERY_KEY, "mine", params] as const;
}

export function allRequestsKey(params: RequestListParams = {}) {
  return [...REQUESTS_QUERY_KEY, "all", params] as const;
}

export function eventRequestsKey(eventId: string, params: RequestListParams = {}) {
  return [...REQUESTS_QUERY_KEY, "event", eventId, params] as const;
}

export function requestDetailKey(id: string) {
  return [...REQUESTS_QUERY_KEY, "detail", id] as const;
}

export function useGetMyRequests(params: RequestListParams = {}) {
  return useQuery({
    queryKey: myRequestsKey(params),
    queryFn: () => getMyRequests(params),
  });
}

export function useGetAllRequests(params: RequestListParams = {}) {
  return useQuery({
    queryKey: allRequestsKey(params),
    queryFn: () => getAllRequests(params),
  });
}

export function useGetRequestsByEvent(
  eventId: string,
  params: RequestListParams = {},
) {
  return useQuery({
    queryKey: eventRequestsKey(eventId, params),
    queryFn: () => getRequestsByEvent(eventId, params),
    enabled: Boolean(eventId),
  });
}

export function useGetRequestById(id: string) {
  return useQuery({
    queryKey: requestDetailKey(id),
    queryFn: () => getRequestById(id),
    enabled: Boolean(id),
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
    },
  });
}

export function useUpdateRequest(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRequestPayload) => updateRequest(id, payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
      queryClient.setQueryData(requestDetailKey(id), response.data);
    },
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
    },
  });
}

export function useSoftDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: softDeleteRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
    },
  });
}
