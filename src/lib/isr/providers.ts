import "server-only";

import { isrFetchJson } from "@/lib/isr/api";
import type {
  GetAllProvidersParams,
  PaginatedApiResponse,
  PaginatedData,
  ProviderWithUser,
  ApiResponse,
} from "@/types";

export const PROVIDERS_CACHE_TAG = "providers";
export const PROVIDERS_REVALIDATE_SECONDS = 120;

export async function getProvidersISR(
  params: GetAllProvidersParams = {},
): Promise<PaginatedData<ProviderWithUser[]> | null> {
  const { page = 1, limit = 50, status } = params;
  const envelope = await isrFetchJson<PaginatedApiResponse<ProviderWithUser[]>>(
    "/provider/all-providers",
    {
      query: { page, limit, ...(status ? { status } : {}) },
      revalidate: PROVIDERS_REVALIDATE_SECONDS,
      tags: [PROVIDERS_CACHE_TAG],
    },
  );

  if (!envelope?.success) {
    return null;
  }

  return { data: envelope.data, meta: envelope.meta };
}

export async function getProviderByIdISR(
  id: string,
): Promise<ProviderWithUser | null> {
  const envelope = await isrFetchJson<ApiResponse<ProviderWithUser>>(
    `/provider/${id}`,
    {
      revalidate: PROVIDERS_REVALIDATE_SECONDS,
      tags: [PROVIDERS_CACHE_TAG, `provider:${id}`],
    },
  );

  if (!envelope?.success) {
    return null;
  }

  return envelope.data;
}

export async function getProviderStaticParams(): Promise<Array<{ id: string }>> {
  const list = await getProvidersISR({ page: 1, limit: 50 });
  if (!list?.data?.length) {
    return [];
  }
  return list.data.map((provider) => ({ id: provider.id }));
}
