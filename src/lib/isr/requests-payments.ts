import "server-only";

import { isrFetchJson } from "@/lib/isr/api";
import type {
  CapacityRequest,
  PaginatedApiResponse,
  PaginatedData,
  PaymentListParams,
  PaymentRecord,
  RequestListParams,
} from "@/types";

export const REQUESTS_CACHE_TAG = "requests";
export const PAYMENTS_CACHE_TAG = "payments";
export const OPS_LIST_REVALIDATE_SECONDS = 60;

export async function getAllRequestsISR(
  params: RequestListParams = {},
): Promise<PaginatedData<CapacityRequest[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  const envelope = await isrFetchJson<PaginatedApiResponse<CapacityRequest[]>>(
    "/request/all",
    {
      query: { page, limit, ...rest },
      revalidate: OPS_LIST_REVALIDATE_SECONDS,
      tags: [REQUESTS_CACHE_TAG],
    },
  );

  if (!envelope?.success) {
    return null;
  }

  return { data: envelope.data, meta: envelope.meta };
}

export async function getAllPaymentsISR(
  params: PaymentListParams = {},
): Promise<PaginatedData<PaymentRecord[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  const envelope = await isrFetchJson<PaginatedApiResponse<PaymentRecord[]>>(
    "/payments/all",
    {
      query: { page, limit, ...rest },
      revalidate: OPS_LIST_REVALIDATE_SECONDS,
      tags: [PAYMENTS_CACHE_TAG],
    },
  );

  if (!envelope?.success) {
    return null;
  }

  return { data: envelope.data, meta: envelope.meta };
}
