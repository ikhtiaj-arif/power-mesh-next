import { HydrationBoundary } from "@tanstack/react-query";

import { OperatorEventsList } from "@/components/modules/events";
import { myEventsKey } from "@/hooks/event.hook";
import {
  createSsrQueryClient,
  dehydrateSsrClient,
  setSsrQueryData,
} from "@/lib/ssr/query-client";
import { getMyEventsSSR } from "@/lib/ssr/queries";

export const dynamic = "force-dynamic";

const defaultParams = { page: 1, limit: 10, status: undefined };

export default async function OperatorEventsPage() {
  const queryClient = createSsrQueryClient();
  setSsrQueryData(
    queryClient,
    myEventsKey(defaultParams),
    await getMyEventsSSR(defaultParams),
  );

  return (
    <HydrationBoundary state={dehydrateSsrClient(queryClient)}>
      <OperatorEventsList basePath="/operator/events" />
    </HydrationBoundary>
  );
}
