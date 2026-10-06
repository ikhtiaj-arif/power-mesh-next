import "server-only";

import { isrFetchJson } from "@/lib/isr/api";
import type {
  AdminUser,
  AdminUserListParams,
  AuditLogEntry,
  AuditLogListParams,
  PaginatedApiResponse,
  PaginatedData,
} from "@/types";

export const USERS_CACHE_TAG = "users";
export const AUDIT_CACHE_TAG = "audit";
export const ADMIN_LIST_REVALIDATE_SECONDS = 60;

export async function getAdminUsersISR(
  params: AdminUserListParams = {},
): Promise<PaginatedData<AdminUser[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  const envelope = await isrFetchJson<PaginatedApiResponse<AdminUser[]>>(
    "/admin/users",
    {
      query: { page, limit, ...rest },
      revalidate: ADMIN_LIST_REVALIDATE_SECONDS,
      tags: [USERS_CACHE_TAG],
    },
  );

  if (!envelope?.success) {
    return null;
  }

  return { data: envelope.data, meta: envelope.meta };
}

export async function getAuditLogsISR(
  params: AuditLogListParams = {},
): Promise<PaginatedData<AuditLogEntry[]> | null> {
  const { page = 1, limit = 10, ...rest } = params;
  const envelope = await isrFetchJson<PaginatedApiResponse<AuditLogEntry[]>>(
    "/admin/audit-logs",
    {
      query: { page, limit, ...rest },
      revalidate: ADMIN_LIST_REVALIDATE_SECONDS,
      tags: [AUDIT_CACHE_TAG],
    },
  );

  if (!envelope?.success) {
    return null;
  }

  return { data: envelope.data, meta: envelope.meta };
}
