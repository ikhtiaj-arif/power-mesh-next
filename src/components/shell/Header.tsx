"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { USER_QUERY_KEY, useGetMe, useLogout } from "@/hooks";
import type { UserRole } from "@/types";

const dashboardRoutes: Record<UserRole, string> = {
  ADMIN: "/admin",
  OPERATOR: "/admin",
  PROVIDER: "/provider",
  CONSUMER: "/dashboard",
};

export function Header() {
  const { data, isError } = useGetMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const queryClient = useQueryClient();
  const router = useRouter();

  const user = isError ? undefined : data?.data;
  const role = user?.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
        toast.add({
          title: "Signed out",
          description: "You have been logged out.",
          type: "success",
        });
        router.push("/login");
        router.refresh();
      },
      onError: () => {
        toast.add({
          title: "Could not sign out",
          description: "Something went wrong. Try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          PowerMesh
        </Link>
        <div className="flex items-center gap-2">
          {role ? (
            <Button
              variant="ghost"
              size="xs"
              render={<Link href={dashboardRoutes[role]} />}
            >
              Dashboard
            </Button>
          ) : null}
          {user ? (
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="xs"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Logout"}
            </Button>
          ) : (
            <Button variant="outline" size="xs" render={<Link href="/login" />}>
              Login
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
