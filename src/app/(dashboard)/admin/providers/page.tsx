import { HydrationBoundary } from "@tanstack/react-query";

import { ProviderQueue } from "@/components/modules/approve-provider";
import { providersListKey } from "@/hooks/provider.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import { getProvidersISR } from "@/lib/isr/providers";

/** Must be a numeric literal for Next.js segment config static analysis. */
export const revalidate = 120;

/** Must match ProviderQueue's initial useMemo params (includes status: undefined). */
const defaultParams = { page: 1, limit: 50, status: undefined };

export default async function AdminProvidersPage() {
  const data = await getProvidersISR(defaultParams);

  return (
    <HydrationBoundary state={dehydratePrefetchedQuery(providersListKey(defaultParams), data)}>
      <ProviderQueue basePath="/admin/providers" />
    </HydrationBoundary>
  );
}
