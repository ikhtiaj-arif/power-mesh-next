import {
  approveAllocation,
  blockAdminUser,
  getAdminUserById,
  getAdminUsers,
  getAuditLogs,
  getDashboardStats,
  previewAllocation,
  softDeleteAdminUser,
  updateReservationStatus,
} from "@/api";
import { EVENTS_QUERY_KEY } from "@/hooks/event.hook";
import { OFFERS_QUERY_KEY } from "@/hooks/offer.hook";
import { REQUESTS_QUERY_KEY } from "@/hooks/request.hook";
import { RESERVATIONS_QUERY_KEY } from "@/hooks/reservation.hook";
import type {
  AdminUserListParams,
  AuditLogListParams,
  BlockUserPayload,
  UpdateReservationStatusPayload,
} from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const ADMIN_QUERY_KEY = ["admin"] as const;

export function dashboardStatsKey() {
  return [...ADMIN_QUERY_KEY, "dashboard-stats"] as const;
}

export function adminUsersKey(params: AdminUserListParams = {}) {
  return [...ADMIN_QUERY_KEY, "users", params] as const;
}

export function adminUserDetailKey(id: string) {
  return [...ADMIN_QUERY_KEY, "users", "detail", id] as const;
}

export function auditLogsKey(params: AuditLogListParams = {}) {
  return [...ADMIN_QUERY_KEY, "audit-logs", params] as const;
}

export function allocationPreviewKey(eventId: string) {
  return [...ADMIN_QUERY_KEY, "allocation-preview", eventId] as const;
}

export function useGetDashboardStats() {
  return useQuery({
    queryKey: dashboardStatsKey(),
    queryFn: getDashboardStats,
  });
}

export function useGetAdminUsers(params: AdminUserListParams = {}) {
  return useQuery({
    queryKey: adminUsersKey(params),
    queryFn: () => getAdminUsers(params),
  });
}

export function useGetAdminUserById(id: string) {
  return useQuery({
    queryKey: adminUserDetailKey(id),
    queryFn: () => getAdminUserById(id),
    enabled: Boolean(id),
  });
}

export function useGetAuditLogs(params: AuditLogListParams = {}) {
  return useQuery({
    queryKey: auditLogsKey(params),
    queryFn: () => getAuditLogs(params),
  });
}

export function usePreviewAllocation(eventId: string) {
  return useMutation({
    mutationKey: allocationPreviewKey(eventId),
    mutationFn: () => previewAllocation(eventId),
  });
}

export function useApproveAllocation(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approveAllocation(eventId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
    },
  });
}

export function useUpdateReservationStatus(reservationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateReservationStatusPayload) =>
      updateReservationStatus(reservationId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
    },
  });
}

export function useBlockAdminUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BlockUserPayload) => blockAdminUser(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: adminUserDetailKey(id) });
    },
  });
}

export function useSoftDeleteAdminUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => softDeleteAdminUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: adminUserDetailKey(id) });
    },
  });
}
