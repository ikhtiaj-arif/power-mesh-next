import { updateMe, updateProfilePicture } from "@/api";
import { USER_QUERY_KEY } from "@/hooks/auth.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}
