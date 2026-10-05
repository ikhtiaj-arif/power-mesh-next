import { applyAsProvider, verifyProviderEmail } from "@/api";
import { USER_QUERY_KEY } from "@/hooks/auth.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
