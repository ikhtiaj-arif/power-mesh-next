import {
  getMe,
  googleLogin,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";
import type { ApiResponse, User } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

/**
 * The signed-in user's own row, as returned by `GET /auth/me`.
 */
export const USER_QUERY_KEY = ["user"] as const;

type UserQueryData = ApiResponse<User> | null;

async function clearUserQuery(queryClient: QueryClient) {
  await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });
  // Keep a logged-out cache entry so active Header observers do not refetch.
  queryClient.setQueryData<UserQueryData>(USER_QUERY_KEY, null);
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogin,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useVerifyAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogout,
    onSuccess: async () => {
      await clearUserQuery(queryClient);
    },
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleLogin,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    // An anonymous visit is a normal 401, not a hard failure for public pages.
    throwOnError: false,
  });
}
