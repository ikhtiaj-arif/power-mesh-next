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

/**
 * Used by generateStaticParams so `next build` emits one ● page per provider id
 * (same shape as /doctors/[id] with nested UUIDs).
 */
export async function getProviderStaticParams(): Promise<Array<{ id: string }>> {
  if (!process.env.API_URL || !process.env.ISR_SERVICE_TOKEN) {
    console.warn(
      "[ISR] Skipping provider static params: set API_URL and ISR_SERVICE_TOKEN so /providers/[id] prerenders at build.",
    );
    // Static export requires at least one entry; real IDs resolve client-side.
    return [{ id: "_" }];
  }

  const ids = new Set<string>();
  const pageSize = 50;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 20) {
    const list = await getProvidersISR({ page, limit: pageSize });
    if (!list?.data?.length) {
      break;
    }

    for (const provider of list.data) {
      if (provider.id) {
        ids.add(provider.id);
      }
    }

    totalPages = Math.max(1, list.meta?.totalPages ?? 1);
    page += 1;
  }

  if (ids.size === 0) {
    console.warn(
      "[ISR] generateStaticParams found 0 providers. Falling back to placeholder. Is the API running with ISR_SERVICE_TOKEN?",
    );
    // Static export requires at least one entry.
    return [{ id: "_" }];
  }

  console.info(`[ISR] generateStaticParams prerendering ${ids.size} provider page(s).`);
  // Always include `_` so Vercel can rewrite unknown ids to a static HTML shell.
  return [{ id: "_" }, ...[...ids].map((id) => ({ id }))];
}
