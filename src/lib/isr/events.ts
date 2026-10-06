import "server-only";

import { isrFetchJson } from "@/lib/isr/api";
import type {
  EventListParams,
  OutageEvent,
  PaginatedApiResponse,
  PaginatedData,
} from "@/types";

export const EVENTS_CACHE_TAG = "events";
export const EVENTS_REVALIDATE_SECONDS = 60;

export async function getAllEventsISR(
  params: EventListParams = {},
): Promise<PaginatedData<OutageEvent[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  const envelope = await isrFetchJson<PaginatedApiResponse<OutageEvent[]>>(
    "/event/all",
    {
      query: { page, limit, ...rest },
      revalidate: EVENTS_REVALIDATE_SECONDS,
      tags: [EVENTS_CACHE_TAG],
    },
  );

  if (!envelope?.success) {
    return null;
  }

  return { data: envelope.data, meta: envelope.meta };
}

export async function getAvailableEventsISR(
  params: EventListParams = {},
): Promise<PaginatedData<OutageEvent[]> | null> {
  const { page = 1, limit = 10, sortBy = "scheduledStart", sortOrder = "asc", ...rest } =
    params;
  const envelope = await isrFetchJson<PaginatedApiResponse<OutageEvent[]>>(
    "/event/available",
    {
      query: { page, limit, sortBy, sortOrder, ...rest },
      revalidate: EVENTS_REVALIDATE_SECONDS,
      tags: [EVENTS_CACHE_TAG],
    },
  );

  if (!envelope?.success) {
    return null;
  }

  return { data: envelope.data, meta: envelope.meta };
}
