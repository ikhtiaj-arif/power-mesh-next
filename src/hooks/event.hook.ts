import {
  createEvent,
  getAllEvents,
  getAvailableEvents,
  getEventById,
  getMyEvents,
  softDeleteEvent,
  updateEvent,
  updateEventStatus,
} from "@/api";
import type { EventListParams, UpdateEventPayload, UpdateEventStatusPayload } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const EVENTS_QUERY_KEY = ["events"] as const;

export function availableEventsKey(params: EventListParams = {}) {
  return [...EVENTS_QUERY_KEY, "available", params] as const;
}

export function myEventsKey(params: EventListParams = {}) {
  return [...EVENTS_QUERY_KEY, "my", params] as const;
}

export function allEventsKey(params: EventListParams = {}) {
  return [...EVENTS_QUERY_KEY, "all", params] as const;
}

export function eventDetailKey(id: string) {
  return [...EVENTS_QUERY_KEY, "detail", id] as const;
}

export function useGetAvailableEvents(params: EventListParams = {}) {
  return useQuery({
    queryKey: availableEventsKey(params),
    queryFn: () => getAvailableEvents(params),
  });
}

export function useGetMyEvents(params: EventListParams = {}, enabled = true) {
  return useQuery({
    queryKey: myEventsKey(params),
    queryFn: () => getMyEvents(params),
    enabled,
  });
}

export function useGetAllEvents(params: EventListParams = {}, enabled = true) {
  return useQuery({
    queryKey: allEventsKey(params),
    queryFn: () => getAllEvents(params),
    enabled,
  });
}

export function useGetEventById(id: string) {
  return useQuery({
    queryKey: eventDetailKey(id),
    queryFn: () => getEventById(id),
    enabled: Boolean(id),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEventPayload) => updateEvent(id, payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      queryClient.setQueryData(eventDetailKey(id), response.data);
    },
  });
}

export function useUpdateEventStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEventStatusPayload) =>
      updateEventStatus(id, payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      queryClient.setQueryData(eventDetailKey(id), response.data);
    },
  });
}

export function useSoftDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: softDeleteEvent,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
}
