import {
  getMe,
  googleLogin,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * The signed-in user's own row, as returned by `GET /auth/me`.
 */
export const USER_QUERY_KEY = ["user"] as const;

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
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
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
  });
}
