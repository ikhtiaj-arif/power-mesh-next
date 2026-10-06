import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  InitiatePaymentPayload,
  InitiatePaymentResult,
  PaginatedApiResponse,
  PaginatedData,
  PaymentListParams,
  PaymentRecord,
} from "@/types";

function withPageLimit(params: PaymentListParams = {}) {
  const { page = 1, limit = 10, ...rest } = params;
  return {
    page,
    limit,
    ...Object.fromEntries(
      Object.entries(rest).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    ),
  };
}

export async function initiatePayment(
  payload: InitiatePaymentPayload,
): Promise<InitiatePaymentResult> {
  const response = await apiClient<ApiResponse<InitiatePaymentResult>>(
    "/payments/initiate",
    { method: "POST", body: payload },
  );
  return response.data;
}

export async function getMyPayments(
  params: PaymentListParams = {},
): Promise<PaginatedData<PaymentRecord[]>> {
  const response = await apiClient<PaginatedApiResponse<PaymentRecord[]>>(
    "/payments/my-payments",
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getPaymentById(id: string): Promise<PaymentRecord> {
  const response = await apiClient<ApiResponse<PaymentRecord>>(`/payments/${id}`, {
    method: "GET",
  });
  return response.data;
}

export async function getAllPayments(
  params: PaymentListParams = {},
): Promise<PaginatedData<PaymentRecord[]>> {
  const response = await apiClient<PaginatedApiResponse<PaymentRecord[]>>(
    "/payments/all",
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}
