import apiClient from "@/lib/api-client";
import type {
  AdminUser,
  AdminUserListParams,
  AllocationPreviewResult,
  ApproveAllocationResult,
  AuditLogEntry,
  AuditLogListParams,
  BlockUserPayload,
  DashboardStats,
  StaffReservationUpdate,
  UpdateReservationStatusPayload,
} from "@/types/admin";
import type { ApiResponse, PaginatedApiResponse, PaginatedData } from "@/types";

function withPageLimit<T extends { page?: number; limit?: number }>(params: T = {} as T) {
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

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient<ApiResponse<DashboardStats>>(
    "/admin/dashboard-stats",
    { method: "GET" },
  );
  return response.data;
}

export function previewAllocation(eventId: string) {
  return apiClient<ApiResponse<AllocationPreviewResult>>(
    `/admin/events/${eventId}/allocate`,
    { method: "POST" },
  );
}

export function approveAllocation(eventId: string) {
  return apiClient<ApiResponse<ApproveAllocationResult>>(
    `/admin/events/${eventId}/approve-allocation`,
    { method: "POST" },
  );
}

export function updateReservationStatus(
  reservationId: string,
  payload: UpdateReservationStatusPayload,
) {
  return apiClient<ApiResponse<StaffReservationUpdate>>(
    `/admin/reservations/${reservationId}/status`,
    { method: "PATCH", body: payload },
  );
}

export async function getAdminUsers(
  params: AdminUserListParams = {},
): Promise<PaginatedData<AdminUser[]>> {
  const response = await apiClient<PaginatedApiResponse<AdminUser[]>>(
    "/admin/users",
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}

export async function getAdminUserById(id: string): Promise<AdminUser> {
  const response = await apiClient<ApiResponse<AdminUser>>(`/admin/users/${id}`, {
    method: "GET",
  });
  return response.data;
}

export function blockAdminUser(id: string, payload: BlockUserPayload) {
  return apiClient<ApiResponse<AdminUser>>(`/admin/users/${id}/block`, {
    method: "PATCH",
    body: payload,
  });
}

export function softDeleteAdminUser(id: string) {
  return apiClient<ApiResponse<AdminUser>>(`/admin/users/${id}/soft-delete`, {
    method: "PATCH",
  });
}

export async function getAuditLogs(
  params: AuditLogListParams = {},
): Promise<PaginatedData<AuditLogEntry[]>> {
  const response = await apiClient<PaginatedApiResponse<AuditLogEntry[]>>(
    "/admin/audit-logs",
    { method: "GET", params: withPageLimit(params) },
  );
  return { data: response.data, meta: response.meta };
}
