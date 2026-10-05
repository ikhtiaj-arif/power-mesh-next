import {
  cancelReservation,
  createReservation,
  getAllReservations,
  getMyReservations,
  getProviderReservations,
  getReservationById,
} from "@/api";
import { OFFERS_QUERY_KEY } from "@/hooks/offer.hook";
import { REQUESTS_QUERY_KEY } from "@/hooks/request.hook";
import type { ReservationListParams } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const RESERVATIONS_QUERY_KEY = ["reservations"] as const;

export function myReservationsKey(params: ReservationListParams = {}) {
  return [...RESERVATIONS_QUERY_KEY, "mine", params] as const;
}

export function allReservationsKey(params: ReservationListParams = {}) {
  return [...RESERVATIONS_QUERY_KEY, "all", params] as const;
}

export function providerReservationsKey(
  providerId: string,
  params: ReservationListParams = {},
) {
  return [...RESERVATIONS_QUERY_KEY, "provider", providerId, params] as const;
}

export function reservationDetailKey(id: string) {
  return [...RESERVATIONS_QUERY_KEY, "detail", id] as const;
}

export function useGetMyReservations(params: ReservationListParams = {}) {
  return useQuery({
    queryKey: myReservationsKey(params),
    queryFn: () => getMyReservations(params),
  });
}

export function useGetAllReservations(params: ReservationListParams = {}) {
  return useQuery({
    queryKey: allReservationsKey(params),
    queryFn: () => getAllReservations(params),
  });
}

export function useGetProviderReservations(
  providerId: string,
  params: ReservationListParams = {},
) {
  return useQuery({
    queryKey: providerReservationsKey(providerId, params),
    queryFn: () => getProviderReservations(providerId, params),
    enabled: Boolean(providerId),
  });
}

export function useGetReservationById(id: string, enabled = true) {
  return useQuery({
    queryKey: reservationDetailKey(id),
    queryFn: () => getReservationById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
    },
  });
}
