import { HydrationBoundary } from "@tanstack/react-query";

import { ConsumerPaymentsList } from "@/components/modules/payments";
import { myPaymentsKey } from "@/hooks/payment.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getMyPaymentsSSR } from "@/lib/ssr/queries";

export const dynamic = "force-dynamic";

const defaultParams = { page: 1, limit: 10 };

export default async function ConsumerPaymentsPage() {
  const queryClient = createSsrQueryClient();
  setSsrQueryData(
    queryClient,
    myPaymentsKey(defaultParams),
    await getMyPaymentsSSR(defaultParams),
  );

  return (
    <HydrationBoundary state={dehydrateSsrClient(queryClient)}>
      <ConsumerPaymentsList />
    </HydrationBoundary>
  );
}
