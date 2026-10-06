import { HydrationBoundary } from "@tanstack/react-query";

import { ProviderOverview } from "@/components/modules/provider/provider-overview";
import { USER_QUERY_KEY } from "@/hooks/auth.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getMeSSR } from "@/lib/ssr/queries";

/** Provider status from /users/me is user-specific. */
export const dynamic = "force-dynamic";

export default async function ProviderHomePage() {
  const queryClient = createSsrQueryClient();
  setSsrQueryData(queryClient, USER_QUERY_KEY, await getMeSSR());

  return (
    <HydrationBoundary state={dehydrateSsrClient(queryClient)}>
      <ProviderOverview />
    </HydrationBoundary>
  );
}
