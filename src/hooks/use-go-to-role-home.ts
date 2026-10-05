"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getMe } from "@/api";
import { USER_QUERY_KEY } from "@/hooks/auth.hook";
import { getRoleHome } from "@/routes";

export function useGoToRoleHome() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    const profile = await queryClient.fetchQuery({
      queryKey: USER_QUERY_KEY,
      queryFn: getMe,
    });
    router.push(getRoleHome(profile.data.role));
  };
}
