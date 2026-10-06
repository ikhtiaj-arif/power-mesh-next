import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { AdminUsersList } from "@/components/modules/admin/admin-users-list";
import { Skeleton } from "@/components/ui/skeleton";
import { adminUsersKey } from "@/hooks/admin.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import {
  ADMIN_LIST_REVALIDATE_SECONDS,
  getAdminUsersISR,
} from "@/lib/isr/admin";

export const revalidate = ADMIN_LIST_REVALIDATE_SECONDS;

const defaultParams = {
  page: 1,
  limit: 10,
  searchTerm: undefined,
  role: undefined,
  status: undefined,
};

export default async function AdminUsersPage() {
  const data = await getAdminUsersISR(defaultParams);

  return (
    <HydrationBoundary state={dehydratePrefetchedQuery(adminUsersKey(defaultParams), data)}>
      <Suspense
        fallback={
          <div className="space-y-3 p-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        <AdminUsersList />
      </Suspense>
    </HydrationBoundary>
  );
}
