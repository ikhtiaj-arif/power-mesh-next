import { HydrationBoundary } from "@tanstack/react-query";

import { ProviderDetail } from "@/components/modules/approve-provider";
import { providerDetailKey } from "@/hooks/provider.hook";
import { dehydratePrefetchedQuery } from "@/lib/isr/hydrate";
import {
  getProviderByIdISR,
  getProviderStaticParams,
  PROVIDERS_REVALIDATE_SECONDS,
} from "@/lib/isr/providers";

export const revalidate = PROVIDERS_REVALIDATE_SECONDS;

export async function generateStaticParams() {
  return getProviderStaticParams();
}

export default async function OperatorProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProviderByIdISR(id);

  return (
    <HydrationBoundary state={dehydratePrefetchedQuery(providerDetailKey(id), data)}>
      <ProviderDetail providerId={id} basePath="/operator/providers" />
    </HydrationBoundary>
  );
}
