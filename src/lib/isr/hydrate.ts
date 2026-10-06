import "server-only";

import {
  dehydrate,
  QueryClient,
  type DehydratedState,
  type QueryKey,
} from "@tanstack/react-query";

export function dehydratePrefetchedQuery<T>(
  queryKey: QueryKey,
  data: T | null | undefined,
): DehydratedState {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  if (data != null) {
    queryClient.setQueryData(queryKey, data);
  }

  return dehydrate(queryClient);
}
