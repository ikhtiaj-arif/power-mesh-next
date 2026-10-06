"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAuditLogs } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { AuditAction } from "@/types";
import { AUDIT_ACTIONS } from "@/types";

export function AdminAuditLog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const limit = Number(searchParams.get("limit") ?? "10") || 10;
  const action = (searchParams.get("action") as AuditAction | null) ?? undefined;
  const entityType = searchParams.get("entityType") ?? undefined;

  const params = useMemo(
    () => ({ page, limit, action, entityType: entityType || undefined }),
    [page, limit, action, entityType],
  );
  const logs = useGetAuditLogs(params);
  const rows = logs.data?.data ?? [];
  const meta = logs.data?.meta;

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
        title="Audit log"
        description="Selected platform actions are recorded here—not every click in the app is audited."
      />

      <Card>
        <CardHeader>
          <CardTitle>Audit entries</CardTitle>
          <CardDescription>
            Filter by `action` or `entityType` via URL params.
            {meta
              ? ` Page ${meta.page} of ${meta.totalPages} (${meta.total} total).`
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={!action ? "default" : "outline"}
              onClick={() => patchParams({ action: undefined, page: "1" })}
            >
              All actions
            </Button>
            {AUDIT_ACTIONS.map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={action === value ? "default" : "outline"}
                onClick={() => patchParams({ action: value, page: "1" })}
              >
                {value}
              </Button>
            ))}
          </div>

          {logs.isPending ? (
            <Skeleton className="h-24 w-full" />
          ) : logs.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getApiErrorMessage(logs.error, "Could not load audit logs.")}
            </p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit entries match this filter.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Actor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-xs">
                        {new Date(entry.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{entry.entityType}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {entry.entityId.slice(0, 8)}…
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.user ? (
                          <>
                            <div className="text-sm">{entry.user.email}</div>
                            <div className="text-xs text-muted-foreground">{entry.user.role}</div>
                          </>
                        ) : (
                          "—"
                        )}
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
