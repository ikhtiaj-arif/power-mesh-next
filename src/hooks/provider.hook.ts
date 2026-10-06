import {
  applyAsProvider,
  approveProvider,
  getAllProviders,
  getProviderById,
  rejectProvider,
  verifyProviderEmail,
} from "@/api";
import { revalidateProvidersCache } from "@/app/actions/revalidate";
import { USER_QUERY_KEY } from "@/hooks/auth.hook";
import type { GetAllProvidersParams } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const PROVIDERS_QUERY_KEY = ["providers"] as const;

export function providersListKey(params: GetAllProvidersParams = {}) {
  return [...PROVIDERS_QUERY_KEY, "list", params] as const;
}

export function providerDetailKey(id: string) {
  return [...PROVIDERS_QUERY_KEY, "detail", id] as const;
}

export function useApplyAsProvider() {
  return useMutation({
    mutationFn: applyAsProvider,
  });
}

export function useVerifyProviderEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyProviderEmail,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useGetAllProviders(params: GetAllProvidersParams = {}) {
  return useQuery({
    queryKey: providersListKey(params),
    queryFn: () => getAllProviders(params),
  });
}

export function useGetProviderById(id: string) {
  return useQuery({
    queryKey: providerDetailKey(id),
    queryFn: () => getProviderById(id),
    enabled: Boolean(id),
  });
}

export function useApproveProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveProvider,
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      queryClient.setQueryData(providerDetailKey(response.data.id), response.data);
      void revalidateProvidersCache();
    },
  });
}

export function useRejectProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectProvider,
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: PROVIDERS_QUERY_KEY });
      queryClient.setQueryData(providerDetailKey(response.data.id), response.data);
      void revalidateProvidersCache();
    },
  });
}
