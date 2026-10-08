"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ProviderStatusBadge } from "@/components/modules/approve-provider/provider-status-badge";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { RecordSheet } from "@/components/modules/shell/record-sheet";
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
import { useGetAllProviders } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ProviderStatus, ProviderWithUser } from "@/types";

const STATUS_FILTERS: Array<{ label: string; value?: ProviderStatus }> = [
  { label: "All" },
  { label: "Pending approval", value: "PENDING_APPROVAL" },
  { label: "Pending email", value: "PENDING_EMAIL_VERIFICATION" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export function ProviderQueue({ basePath }: { basePath: string }) {
  const [status, setStatus] = useState<ProviderStatus | undefined>(undefined);
  const [selected, setSelected] = useState<ProviderWithUser | null>(null);
  const params = useMemo(() => ({ page: 1, limit: 50, status }), [status]);
  const providers = useGetAllProviders(params);

  const rows = providers.data?.data ?? [];
  const meta = providers.data?.meta;
  const total = meta?.total ?? rows.length;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Providers"
        description="Review provider applications, then approve or reject."
      />

      <Card>
        <CardHeader>
          <CardTitle>Provider queue</CardTitle>
          <CardDescription>
            Showing the first {params.limit} matching rows
            {meta ? ` of ${total} total` : ""}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => {
              const active = status === filter.value;
              return (
                <Button
                  key={filter.label}
                  type="button"
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => setStatus(filter.value)}
                >
                  {filter.label}
                </Button>
              );
            })}
          </div>

          {providers.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : null}

          {providers.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getApiErrorMessage(
                providers.error,
                "Could not load providers.",
              )}
            </p>
          ) : null}

          {!providers.isPending && !providers.isError ? (
            rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No providers match this filter.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="font-medium">{provider.companyName}</div>
                        <div className="text-xs text-muted-foreground">
                          {provider.licenseNumber} · {provider.resourceType}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {provider.user.firstName} {provider.user.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {provider.user.email}
                        </div>
                      </TableCell>
                      <TableCell>{provider.capacityKw} kW</TableCell>
                      <TableCell>
                        <ProviderStatusBadge status={provider.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelected(provider)}
                        >
                          Preview
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          ) : null}
        </CardContent>
      </Card>

      <RecordSheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected?.companyName ?? "Provider"}
        description={
          selected
            ? `${selected.licenseNumber} · ${selected.resourceType}`
            : undefined
        }
        size="lg"
        fullPageHref={selected ? `${basePath}/${selected.id}` : undefined}
        fullPageLabel="Review & decide"
        footer={
          selected ? (
            <Button
              render={<Link href={`${basePath}/${selected.id}`} />}
              onClick={() => setSelected(null)}
            >
              Open full review
            </Button>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Status</span>
              <ProviderStatusBadge status={selected.status} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">{selected.capacityKw} kW</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Contact</span>
              <span className="font-medium text-right">
                {selected.user.firstName} {selected.user.lastName}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-right">{selected.user.email}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{selected.contactPhone}</span>
            </div>
            <p className="rounded-lg border bg-muted/40 p-3 text-muted-foreground">
              {selected.address}
            </p>
          </div>
        ) : null}
      </RecordSheet>
    </div>
  );
}
