import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  AuthTokens,
  GoogleLoginPayload,
  LoginPayload,
  RegisterConsumerPayload,
  RegisterConsumerResult,
  User,
  VerifyEmailPayload,
  VerifyEmailResult,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function userRegistration(payload: RegisterConsumerPayload) {
  return apiClient<ApiResponse<RegisterConsumerResult>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyAccount(payload: VerifyEmailPayload) {
  return apiClient<ApiResponse<VerifyEmailResult>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function googleLogin(payload: GoogleLoginPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/google-login", {
    method: "POST",
    body: payload,
  });
}

export function userLogout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient<ApiResponse<User>>("/users/me", { method: "GET" });
}
