import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  ApplyAsProviderPayload,
  ApplyAsProviderResult,
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
