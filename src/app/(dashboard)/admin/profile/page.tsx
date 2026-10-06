import { Suspense } from "react";
import { HydrationBoundary } from "@tanstack/react-query";

import { ProfileView } from "@/components/modules/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_QUERY_KEY } from "@/hooks/auth.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getMeSSR } from "@/lib/ssr/queries";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const queryClient = createSsrQueryClient();
  setSsrQueryData(queryClient, USER_QUERY_KEY, await getMeSSR());

  return (
    <HydrationBoundary state={dehydrateSsrClient(queryClient)}>
      <Suspense
        fallback={
          <div className="space-y-3 p-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        <ProfileView />
      </Suspense>
    </HydrationBoundary>
  );
}
