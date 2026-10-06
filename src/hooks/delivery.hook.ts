import {
  consumerConfirm,
  consumerDispute,
  getDeliveryByReservation,
  providerCheckIn,
  providerReport,
} from "@/api";
import { RESERVATIONS_QUERY_KEY } from "@/hooks/reservation.hook";
import type { ConsumerDisputePayload, ProviderReportPayload } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const DELIVERY_QUERY_KEY = ["delivery"] as const;

export function deliveryByReservationKey(reservationId: string) {
  return [...DELIVERY_QUERY_KEY, "reservation", reservationId] as const;
}

export function useGetDeliveryByReservation(
  reservationId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: deliveryByReservationKey(reservationId),
    queryFn: () => getDeliveryByReservation(reservationId),
    enabled: Boolean(reservationId) && enabled,
    staleTime: 15_000,
  });
}

export function useProviderCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) => providerCheckIn(reservationId),
    onSuccess: (_data, reservationId) => {
      void queryClient.invalidateQueries({
        queryKey: deliveryByReservationKey(reservationId),
      });
      void queryClient.invalidateQueries({ queryKey: DELIVERY_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
    },
  });
}

export function useProviderReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reservationId,
      payload,
    }: {
      reservationId: string;
      payload: ProviderReportPayload;
    }) => providerReport(reservationId, payload),
    onSuccess: (_data, { reservationId }) => {
      void queryClient.invalidateQueries({
        queryKey: deliveryByReservationKey(reservationId),
      });
      void queryClient.invalidateQueries({ queryKey: DELIVERY_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
    },
  });
}

export function useConsumerConfirmDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) => consumerConfirm(reservationId),
    onSuccess: (_data, reservationId) => {
      void queryClient.invalidateQueries({
        queryKey: deliveryByReservationKey(reservationId),
      });
      void queryClient.invalidateQueries({ queryKey: DELIVERY_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
    },
  });
}

export function useConsumerDisputeDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reservationId,
      payload,
    }: {
      reservationId: string;
      payload: ConsumerDisputePayload;
    }) => consumerDispute(reservationId, payload),
    onSuccess: (_data, { reservationId }) => {
      void queryClient.invalidateQueries({
        queryKey: deliveryByReservationKey(reservationId),
      });
      void queryClient.invalidateQueries({ queryKey: DELIVERY_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
    },
  });
}
