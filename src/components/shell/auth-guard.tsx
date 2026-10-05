"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useGetMe } from "@/hooks";
import { getRoleHome, isRolePath } from "@/lib/role-home";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Array<"CONSUMER" | "PROVIDER" | "OPERATOR" | "ADMIN">;
}) {
  const { data, isPending, isError } = useGetMe();
  const router = useRouter();
  const pathname = usePathname();
  const user = isError || data == null ? undefined : data.data;

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allow && !allow.includes(user.role)) {
      router.replace(getRoleHome(user.role));
      return;
    }

    if (!isRolePath(pathname, user.role)) {
      router.replace(getRoleHome(user.role));
    }
  }, [allow, isPending, pathname, router, user]);

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6 text-sm text-muted-foreground">
        Redirecting to{" "}
        <Link href="/login" className="ml-1 underline">
          sign in
        </Link>
        …
      </div>
    );
  }

  if (
    (allow && !allow.includes(user.role)) ||
    !isRolePath(pathname, user.role)
  ) {
    return null;
  }

  return children;
}
