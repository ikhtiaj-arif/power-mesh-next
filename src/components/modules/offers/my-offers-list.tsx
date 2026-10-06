"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { OfferStatusBadge } from "@/components/modules/offers/offer-status-badge";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
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
import { useGetMe, useGetMyOffers } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { OfferStatus } from "@/types";

const STATUS_FILTERS: Array<{ label: string; value?: OfferStatus }> = [
  { label: "All" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Partial", value: "PARTIALLY_AVAILABLE" },
  { label: "Fully allocated", value: "FULLY_ALLOCATED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function MyOffersList({ basePath }: { basePath: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const me = useGetMe();
  const isApproved = me.data?.data.provider?.status === "APPROVED";

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const limit = Number(searchParams.get("limit") ?? "10") || 10;
  const status = (searchParams.get("status") as OfferStatus | null) ?? undefined;

  const params = useMemo(() => ({ page, limit, status }), [page, limit, status]);
  const offers = useGetMyOffers(params);
  const rows = offers.data?.data ?? [];
  const meta = offers.data?.meta;

  function patchParams(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (!value) next.delete(key);
      else next.set(key, value);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <OverviewHeader
          title="My offers"
          description="Capacity you published for outage events."
        />
        {isApproved ? (
          <Button size="sm" render={<Link href={`${basePath}/new`} />}>
            Create offer
          </Button>
        ) : null}
      </div>

      {!isApproved && !me.isPending ? (
        <p className="text-sm text-muted-foreground">
          Offer management requires an approved provider profile. Check your
          provider home for approval status.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Offers</CardTitle>
          <CardDescription>
            Loaded from `GET /offer/my-offers` only.
            {meta
              ? ` Page ${meta.page} of ${meta.totalPages} (${meta.total} total).`
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter.label}
                type="button"
                size="sm"
                variant={status === filter.value ? "default" : "outline"}
                onClick={() =>
                  patchParams({
                    status: filter.value,
                    page: "1",
                    limit: String(limit),
                  })
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {offers.isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : null}

          {offers.isError ? (
            <p className="text-sm text-destructive" role="alert">
              {getApiErrorMessage(offers.error, "Could not load offers.")}
            </p>
          ) : null}

          {!offers.isPending && !offers.isError ? (
            rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No offers match these filters.
                {isApproved
                  ? " Create one for an available event."
                  : null}
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event window</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                          <div className="font-medium">
                            {formatEventDate(offer.event?.scheduledStart)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            to {formatEventDate(offer.event?.scheduledEnd)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {offer.capacityKw} kW
                          <div className="text-xs text-muted-foreground">
                            {offer.reservedKw} kW reserved
                          </div>
                        </TableCell>
                        <TableCell>৳{String(offer.pricePerKwh)}/kWh</TableCell>
                        <TableCell>
                          <OfferStatusBadge status={offer.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            render={<Link href={`${basePath}/${offer.id}`} />}
                          >
                            Open
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {meta && meta.totalPages > 1 ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() =>
                        patchParams({ page: String(page - 1), limit: String(limit) })
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={page >= meta.totalPages}
                      onClick={() =>
                        patchParams({ page: String(page + 1), limit: String(limit) })
                      }
                    >
                      Next
                    </Button>
                  </div>
                ) : null}
              </>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
