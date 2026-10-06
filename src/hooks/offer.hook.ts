import {
  createOffer,
  getMyOffers,
  getOfferById,
  getOffersByEvent,
  softDeleteOffer,
  updateOffer,
} from "@/api";
import type { OfferListParams, UpdateOfferPayload } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const OFFERS_QUERY_KEY = ["offers"] as const;

export function eventOffersKey(eventId: string, params: OfferListParams = {}) {
  return [...OFFERS_QUERY_KEY, "event", eventId, params] as const;
}

export function myOffersKey(params: OfferListParams = {}) {
  return [...OFFERS_QUERY_KEY, "mine", params] as const;
}

export function offerDetailKey(id: string) {
  return [...OFFERS_QUERY_KEY, "detail", id] as const;
}

export function useGetOffersByEvent(
  eventId: string,
  params: OfferListParams = {},
) {
  return useQuery({
    queryKey: eventOffersKey(eventId, params),
    queryFn: () => getOffersByEvent(eventId, params),
    enabled: Boolean(eventId),
  });
}

export function useGetMyOffers(params: OfferListParams = {}) {
  return useQuery({
    queryKey: myOffersKey(params),
    queryFn: () => getMyOffers(params),
  });
}

export function useGetOfferById(id: string) {
  return useQuery({
    queryKey: offerDetailKey(id),
    queryFn: () => getOfferById(id),
    enabled: Boolean(id),
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
    },
  });
}

export function useUpdateOffer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOfferPayload) => updateOffer(id, payload),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
      queryClient.setQueryData(offerDetailKey(id), response.data);
    },
  });
}

export function useSoftDeleteOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: softDeleteOffer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
    },
  });
}
