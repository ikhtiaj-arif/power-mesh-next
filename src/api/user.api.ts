import apiClient from "@/lib/api-client";
import type { ApiResponse, UpdateMePayload, User } from "@/types";

export function updateMe(payload: UpdateMePayload) {
  return apiClient<ApiResponse<User>>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}

export function updateProfilePicture(file: File) {
  const formData = new FormData();
  formData.append("profilePicture", file);

  return apiClient<ApiResponse<User>>("/users/me/profile-picture", {
    method: "PATCH",
    body: formData,
  });
}
