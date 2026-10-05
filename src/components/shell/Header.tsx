"use client";

import { googleLogout } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { getRoleHome } from "@/routes";

export function Header() {
  const { data, isError } = useGetMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const router = useRouter();

  const user = isError || data == null ? undefined : data.data;
  const role = user?.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        googleLogout();
        toast.add({
          title: "Signed out",
          description: "You have been logged out.",
          type: "success",
        });
        // Stay on a public page that does not mount the Google iframe.
        router.push("/");
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
              render={<Link href={getRoleHome(role)} />}
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
