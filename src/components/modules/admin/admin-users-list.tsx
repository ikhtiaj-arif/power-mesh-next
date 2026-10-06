"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAdminUsers } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { UserRole, UserStatus } from "@/types";

const ROLES: UserRole[] = ["CONSUMER", "PROVIDER", "OPERATOR", "ADMIN"];
const STATUSES: UserStatus[] = ["ACTIVE", "BLOCKED", "DELETED"];

export function AdminUsersList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const limit = Number(searchParams.get("limit") ?? "10") || 10;
  const searchTerm = searchParams.get("searchTerm") ?? undefined;
  const role = (searchParams.get("role") as UserRole | null) ?? undefined;
  const status = (searchParams.get("status") as UserStatus | null) ?? undefined;

  const params = useMemo(
    () => ({ page, limit, searchTerm, role, status }),
    [page, limit, searchTerm, role, status],
  );
  const users = useGetAdminUsers(params);
  const rows = users.data?.data ?? [];
  const meta = users.data?.meta;

  function patchParams(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Users"
        description="Search and filter platform accounts. Blocked users receive 403 on subsequent API calls."
      />

      <Card>
        <CardHeader>
          <CardTitle>User directory</CardTitle>
          <CardDescription>
            Pagination uses `meta`. Filters: `searchTerm`, `role`, `status`.
            {meta
              ? ` Page ${meta.page} of ${meta.totalPages} (${meta.total} total).`
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="flex max-w-md flex-col gap-2 sm:flex-row sm:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const term = (form.elements.namedItem("searchTerm") as HTMLInputElement).value;
              patchParams({
                searchTerm: term.trim() || undefined,
                page: "1",
                limit: String(limit),
              });
            }}
          >
            <div className="flex-1 space-y-1">
              <Label htmlFor="searchTerm">Search</Label>
              <Input
                id="searchTerm"
                name="searchTerm"
                defaultValue={searchTerm ?? ""}
                placeholder="Name or email"
              />
            </div>
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={!role ? "default" : "outline"}
              onClick={() => patchParams({ role: undefined, page: "1" })}
            >
              All roles
            </Button>
            {ROLES.map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={role === value ? "default" : "outline"}
                onClick={() => patchParams({ role: value, page: "1" })}
              >
                {value}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={!status ? "default" : "outline"}
              onClick={() => patchParams({ status: undefined, page: "1" })}
            >
              All statuses
            </Button>
            {STATUSES.map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={status === value ? "default" : "outline"}
                onClick={() => patchParams({ status: value, page: "1" })}
              >
                {value}
              </Button>
            ))}
          </div>

          {users.isPending ? (
            <Skeleton className="h-24 w-full" />
          ) : users.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getApiErrorMessage(users.error, "Could not load users.")}
            </p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users match this filter.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          render={<Link href={`/admin/users/${user.id}`} />}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {meta && meta.totalPages > 1 ? (
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => patchParams({ page: String(page - 1) })}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={page >= meta.totalPages}
                    onClick={() => patchParams({ page: String(page + 1) })}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
