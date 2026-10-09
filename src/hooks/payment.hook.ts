import {
  confirmStripeCheckout,
  getAllPayments,
  getMyPayments,
  getPaymentById,
  initiatePayment,
} from "@/api";
import { RESERVATIONS_QUERY_KEY } from "@/hooks/reservation.hook";
import type { InitiatePaymentPayload, PaymentListParams } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const PAYMENTS_QUERY_KEY = ["payments"] as const;

export function myPaymentsKey(params: PaymentListParams = {}) {
  return [...PAYMENTS_QUERY_KEY, "mine", params] as const;
}

export function allPaymentsKey(params: PaymentListParams = {}) {
  return [...PAYMENTS_QUERY_KEY, "all", params] as const;
}

export function paymentDetailKey(id: string) {
  return [...PAYMENTS_QUERY_KEY, "detail", id] as const;
}

export function useGetMyPayments(
  params: PaymentListParams = {},
  options?: { staleTime?: number; refetchOnWindowFocus?: boolean },
) {
  return useQuery({
    queryKey: myPaymentsKey(params),
    queryFn: () => getMyPayments(params),
    staleTime: options?.staleTime,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
  });
}

export function useGetAllPayments(params: PaymentListParams = {}) {
  return useQuery({
    queryKey: allPaymentsKey(params),
    queryFn: () => getAllPayments(params),
  });
}

export function useGetPaymentById(id: string, enabled = true) {
  return useQuery({
    queryKey: paymentDetailKey(id),
    queryFn: () => getPaymentById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useInitiatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InitiatePaymentPayload) => initiatePayment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
    },
  });
}

export function useConfirmStripeCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => confirmStripeCheckout(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
    },
  });
}
