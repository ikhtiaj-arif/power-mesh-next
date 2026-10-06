import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  ConsumerConfirmResult,
  ConsumerDisputePayload,
  Delivery,
  DeliveryReservationDetail,
  ProviderReportPayload,
} from "@/types";

export async function getDeliveryByReservation(
  reservationId: string,
): Promise<DeliveryReservationDetail> {
  const response = await apiClient<ApiResponse<DeliveryReservationDetail>>(
    `/delivery/${reservationId}`,
    { method: "GET" },
  );
  return response.data;
}

export async function providerCheckIn(reservationId: string): Promise<Delivery> {
  const response = await apiClient<ApiResponse<Delivery>>(
    `/delivery/${reservationId}/provider-check-in`,
    { method: "POST" },
  );
  return response.data;
}

export async function providerReport(
  reservationId: string,
  payload: ProviderReportPayload,
): Promise<Delivery> {
  const response = await apiClient<ApiResponse<Delivery>>(
    `/delivery/${reservationId}/provider-report`,
    { method: "POST", body: payload },
  );
  return response.data;
}

export async function consumerConfirm(
  reservationId: string,
): Promise<ConsumerConfirmResult> {
  const response = await apiClient<ApiResponse<ConsumerConfirmResult>>(
    `/delivery/${reservationId}/consumer-confirm`,
    { method: "POST" },
  );
  return response.data;
}

export async function consumerDispute(
  reservationId: string,
  payload: ConsumerDisputePayload,
): Promise<Delivery> {
  const response = await apiClient<ApiResponse<Delivery>>(
    `/delivery/${reservationId}/consumer-dispute`,
    { method: "POST", body: payload },
  );
  return response.data;
}
