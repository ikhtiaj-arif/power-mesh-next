"use client";

import { AdminUserDetail } from "@/components/modules/admin/admin-user-detail";
import {
  MissingStaticId,
  useStaticRouteId,
} from "@/components/shell/static-id-page";

export default function AdminUserDetailClient() {
  const id = useStaticRouteId();
  if (!id) return <MissingStaticId />;
  return <AdminUserDetail userId={id} />;
}
