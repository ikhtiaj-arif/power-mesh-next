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
import { cn } from "@/lib/utils";
import type { ProviderStatus } from "@/types";

const statusCopy: Record<ProviderStatus, { title: string; body: string }> = {
  PENDING_EMAIL_VERIFICATION: {
    title: "Verify your email",
    body: "Complete email verification before an operator can review your application.",
  },
  PENDING_APPROVAL: {
    title: "Awaiting operator approval",
    body: "Your provider profile is under review. You can browse the desk, but publishing offers requires approval.",
  },
  APPROVED: {
    title: "Approved provider",
    body: "Publish offers for available outage events and fulfill allocated reservations.",
  },
  REJECTED: {
    title: "Application rejected",
    body: "Your application was not approved. Contact an operator if you need to re-apply.",
  },
};

const timeline: { key: ProviderStatus | "APPLIED"; label: string }[] = [
  { key: "APPLIED", label: "Applied" },
  { key: "PENDING_EMAIL_VERIFICATION", label: "Email" },
  { key: "PENDING_APPROVAL", label: "Review" },
  { key: "APPROVED", label: "Approved" },
];

function timelineIndex(status?: ProviderStatus) {
  if (!status) return 0;
  if (status === "REJECTED") return 2;
  if (status === "PENDING_EMAIL_VERIFICATION") return 1;
  if (status === "PENDING_APPROVAL") return 2;
  if (status === "APPROVED") return 3;
  return 0;
}

export function ProviderOverview() {
  const me = useGetMe();
  const user = me.data?.data;
  const provider = user?.provider;
  const status = provider?.status as ProviderStatus | undefined;
  const activeStep = timelineIndex(status);

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Home"
        description="Your approval status and the next step to publish backup capacity."
        actions={
          status === "APPROVED" ? (
            <Button size="sm" render={<Link href="/provider/offers/new" />}>
              Create offer
            </Button>
          ) : null
        }
      />

      {me.isPending ? <Skeleton className="h-40 w-full rounded-xl" /> : null}

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
        <>
          <Card>
            <CardHeader>
              <CardTitle>Onboarding</CardTitle>
              <CardDescription>
                {provider.companyName} · {provider.capacityKw} kW capacity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-2 sm:grid-cols-4">
                {timeline.map((step, index) => (
                  <li
                    key={step.key}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm",
                      index <= activeStep && status !== "REJECTED"
                        ? "border-primary/30 bg-primary/5 font-medium"
                        : "text-muted-foreground",
                      status === "REJECTED" && index === 2
                        ? "border-destructive/40 bg-destructive/5 text-destructive"
                        : null,
                    )}
                  >
                    {status === "REJECTED" && index === 2
                      ? "Rejected"
                      : step.label}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>{statusCopy[status].title}</CardTitle>
                <CardDescription>{statusCopy[status].body}</CardDescription>
              </div>
              <ProviderStatusBadge status={status} />
            </CardHeader>
            <CardContent className="space-y-4">
              {status === "REJECTED" && provider.rejectionReason ? (
                <p className="text-sm">
                  <span className="text-muted-foreground">Reason: </span>
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
                    render={<Link href="/provider/delivery" />}
                  >
                    Delivery queue
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Offer and delivery tools unlock after approval.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
