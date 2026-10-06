import { HydrationBoundary } from "@tanstack/react-query";

import { ProviderQueue } from "@/components/modules/approve-provider";
import { providersListKey } from "@/hooks/provider.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import {
  getProvidersISR,
  PROVIDERS_REVALIDATE_SECONDS,
} from "@/lib/isr/providers";

export const revalidate = PROVIDERS_REVALIDATE_SECONDS;

/** Must match ProviderQueue's initial useMemo params (includes status: undefined). */
const defaultParams = { page: 1, limit: 50, status: undefined };

export default async function OperatorProvidersPage() {
  const data = await getProvidersISR(defaultParams);

  return (
    <HydrationBoundary state={dehydratePrefetchedQuery(providersListKey(defaultParams), data)}>
      <ProviderQueue basePath="/operator/providers" />
    </HydrationBoundary>
  );
}
