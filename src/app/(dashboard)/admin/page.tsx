import { HydrationBoundary } from "@tanstack/react-query";

import { AdminOverview } from "@/components/modules/admin/admin-overview";
import { dashboardStatsKey } from "@/hooks/admin.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getDashboardStatsSSR } from "@/lib/ssr/queries";

/** Admin stats require the signed-in admin session. */
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const queryClient = createSsrQueryClient();
  setSsrQueryData(queryClient, dashboardStatsKey(), await getDashboardStatsSSR());

  return (
    <HydrationBoundary state={dehydrateSsrClient(queryClient)}>
      <AdminOverview />
    </HydrationBoundary>
  );
}
