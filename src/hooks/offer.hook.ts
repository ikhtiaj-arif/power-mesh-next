import { getOffersByEvent } from "@/api";
import type { OfferListParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const OFFERS_QUERY_KEY = ["offers"] as const;

export function eventOffersKey(eventId: string, params: OfferListParams = {}) {
  return [...OFFERS_QUERY_KEY, "event", eventId, params] as const;
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
