"use client";

import Link from "next/link";

import { ProviderStatusBadge } from "@/components/modules/approve-provider/provider-status-badge";
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
import { useGetMe } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ProviderStatus } from "@/types";

const statusCopy: Record<ProviderStatus, { title: string; body: string }> = {
  PENDING_EMAIL_VERIFICATION: {
    title: "Verify your email",
    body: "Complete provider email verification before an operator can review your application. Offer creation stays disabled until you are APPROVED.",
  },
  PENDING_APPROVAL: {
    title: "Awaiting operator approval",
    body: "Your provider profile is under review. You can browse the dashboard, but publishing capacity requires APPROVED status.",
  },
  APPROVED: {
    title: "Approved provider",
    body: "You can publish offers for available outage events and manage reservations allocated against them.",
  },
  REJECTED: {
    title: "Application rejected",
    body: "Your provider application was not approved. Offer links stay hidden until an operator approves a valid profile.",
  },
};

export function ProviderOverview() {
  const me = useGetMe();
  const user = me.data?.data;
  const provider = user?.provider;
  const status = provider?.status as ProviderStatus | undefined;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Provider overview"
        description="Approval status from `/users/me` controls whether you can publish offers."
      />

      {me.isPending ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : null}

      {me.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(me.error, "Could not load your profile.")}
        </p>
      ) : null}

      {!me.isPending && !provider ? (
        <p className="text-sm text-muted-foreground">
          No provider profile on this account.
        </p>
      ) : null}

      {provider && status && statusCopy[status] ? (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>{statusCopy[status].title}</CardTitle>
              <CardDescription>
                {provider.companyName} · {statusCopy[status].body}
              </CardDescription>
            </div>
            <ProviderStatusBadge status={status} />
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "REJECTED" && provider.rejectionReason ? (
              <p className="text-sm">
                <span className="text-muted-foreground">Rejection reason: </span>
                <span className="font-medium">{provider.rejectionReason}</span>
              </p>
            ) : null}

            {status === "APPROVED" ? (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" render={<Link href="/provider/offers" />}>
                  My offers
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  render={<Link href="/provider/offers/new" />}
                >
                  Create offer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  render={<Link href="/provider/reservations" />}
                >
                  Reservations
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Offer create links appear here once your provider status is
                APPROVED. The client does not call approve on your behalf.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
