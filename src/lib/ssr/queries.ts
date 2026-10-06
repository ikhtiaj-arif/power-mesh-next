import "server-only";

import { ssrFetchJson } from "@/lib/ssr/api";
import type {
  ApiResponse,
  CapacityOffer,
  CapacityRequest,
  DashboardStats,
  EventListParams,
  OfferListParams,
  OutageEvent,
  PaginatedApiResponse,
  PaginatedData,
  PaymentListParams,
  PaymentRecord,
  RequestListParams,
  Reservation,
  ReservationListParams,
  User,
} from "@/types";

function asPage<T>(
  envelope: PaginatedApiResponse<T> | null,
): PaginatedData<T> | null {
  if (!envelope?.success) {
    return null;
  }
  return { data: envelope.data, meta: envelope.meta };
}

export async function getMeSSR(): Promise<ApiResponse<User> | null> {
  return ssrFetchJson<ApiResponse<User>>("/users/me");
}

export async function getDashboardStatsSSR(): Promise<DashboardStats | null> {
  const envelope = await ssrFetchJson<ApiResponse<DashboardStats>>(
    "/admin/dashboard-stats",
  );
  return envelope?.success ? envelope.data : null;
}

export async function getAvailableEventsSSR(
  params: EventListParams = {},
): Promise<PaginatedData<OutageEvent[]> | null> {
  const {
    page = 1,
    limit = 10,
    sortBy = "scheduledStart",
    sortOrder = "asc",
    ...rest
  } = params;
  return asPage(
    await ssrFetchJson<PaginatedApiResponse<OutageEvent[]>>("/event/available", {
      query: { page, limit, sortBy, sortOrder, ...rest },
    }),
  );
}

export async function getMyEventsSSR(
  params: EventListParams = {},
): Promise<PaginatedData<OutageEvent[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  return asPage(
    await ssrFetchJson<PaginatedApiResponse<OutageEvent[]>>("/event/my-events", {
      query: { page, limit, ...rest },
    }),
  );
}

export async function getMyRequestsSSR(
  params: RequestListParams = {},
): Promise<PaginatedData<CapacityRequest[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  return asPage(
    await ssrFetchJson<PaginatedApiResponse<CapacityRequest[]>>(
      "/request/my-requests",
      { query: { page, limit, ...rest } },
    ),
  );
}

export async function getMyReservationsSSR(
  params: ReservationListParams = {},
): Promise<PaginatedData<Reservation[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  return asPage(
    await ssrFetchJson<PaginatedApiResponse<Reservation[]>>(
      "/reservation/my-reservations",
      { query: { page, limit, ...rest } },
    ),
  );
}

export async function getProviderReservationsSSR(
  providerId: string,
  params: ReservationListParams = {},
): Promise<PaginatedData<Reservation[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  return asPage(
    await ssrFetchJson<PaginatedApiResponse<Reservation[]>>(
      `/reservation/provider/${providerId}`,
      { query: { page, limit, ...rest } },
    ),
  );
}

export async function getMyPaymentsSSR(
  params: PaymentListParams = {},
): Promise<PaginatedData<PaymentRecord[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  return asPage(
    await ssrFetchJson<PaginatedApiResponse<PaymentRecord[]>>(
      "/payments/my-payments",
      { query: { page, limit, ...rest } },
    ),
  );
}

export async function getMyOffersSSR(
  params: OfferListParams = {},
): Promise<PaginatedData<CapacityOffer[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  return asPage(
    await ssrFetchJson<PaginatedApiResponse<CapacityOffer[]>>("/offer/my-offers", {
      query: { page, limit, ...rest },
    }),
  );
}
