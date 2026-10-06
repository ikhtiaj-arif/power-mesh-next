import "server-only";

import {
  dehydrate,
  QueryClient,
  type DehydratedState,
  type QueryKey,
} from "@tanstack/react-query";

export function createSsrQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
}

export function setSsrQueryData<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  data: T | null | undefined,
) {
  if (data != null) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function dehydrateSsrClient(queryClient: QueryClient): DehydratedState {
  return dehydrate(queryClient);
}
