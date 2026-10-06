import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  ApplyAsProviderPayload,
  ApplyAsProviderResult,
  ApproveProviderPayload,
  GetAllProvidersParams,
  PaginatedApiResponse,
  PaginatedData,
  ProviderWithUser,
  RejectProviderPayload,
  VerifyProviderEmailPayload,
  VerifyProviderEmailResult,
} from "@/types";

export function applyAsProvider(payload: ApplyAsProviderPayload) {
  return apiClient<ApiResponse<ApplyAsProviderResult>>(
    "/provider/apply-as-provider",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function verifyProviderEmail(payload: VerifyProviderEmailPayload) {
  return apiClient<ApiResponse<VerifyProviderEmailResult>>(
    "/provider/verify-email",
    {
      method: "POST",
      body: payload,
    },
  );
}

/** `limit` caps the slice. Skip is ignored by the API (BX-08). */
export async function getAllProviders(
  params: GetAllProvidersParams = {},
): Promise<PaginatedData<ProviderWithUser[]>> {
  const { page = 1, limit = 10, status } = params;
  const requestParams = {
    page,
    limit,
    ...(status ? { status } : {}),
  };

  const response = await apiClient<PaginatedApiResponse<ProviderWithUser[]>>(
    "/provider/all-providers",
    {
      method: "GET",
      params: requestParams,
    },
  );

  return { data: response.data, meta: response.meta };
}

export async function getProviderById(id: string): Promise<ProviderWithUser> {
  const response = await apiClient<ApiResponse<ProviderWithUser>>(
    `/provider/${id}`,
  );
  return response.data;
}

export function approveProvider(payload: ApproveProviderPayload) {
  return apiClient<ApiResponse<ProviderWithUser>>("/provider/approve-provider", {
    method: "PATCH",
    body: payload,
  });
}

export function rejectProvider(payload: RejectProviderPayload) {
  return apiClient<ApiResponse<ProviderWithUser>>("/provider/reject-provider", {
    method: "PATCH",
    body: payload,
  });
}
