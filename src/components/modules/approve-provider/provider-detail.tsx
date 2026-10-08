"use client";

import Link from "next/link";

import { ProviderStatusBadge } from "@/components/modules/approve-provider/provider-status-badge";
import { RejectProviderForm } from "@/components/modules/approve-provider/reject-provider-form";
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
import { toast } from "@/components/ui/toast";
import { useApproveProvider, useGetProviderById } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ProviderStatus } from "@/types";

function canApprove(status: ProviderStatus) {
  return status !== "APPROVED" && status !== "REJECTED";
}

function canReject(status: ProviderStatus) {
  return status !== "REJECTED";
}

export function ProviderDetail({
  providerId,
  basePath,
  embedded = false,
}: {
  providerId: string;
  basePath: string;
  /** Hide page chrome when rendered inside a preview sheet. */
  embedded?: boolean;
}) {
  const detail = useGetProviderById(providerId);
  const approve = useApproveProvider();
  const provider = detail.data;

  return (
    <div className="space-y-6">
      {embedded ? null : (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <OverviewHeader
            title={provider?.companyName ?? "Provider"}
            description="Review capacity, contact details, and approval status."
          />
          <Button variant="outline" size="sm" render={<Link href={basePath} />}>
            Back to queue
          </Button>
        </div>
      )}

      {detail.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : null}

      {detail.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(detail.error, "Could not load this provider.")}
        </p>
      ) : null}

      {provider ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>Application</CardTitle>
                <CardDescription>
                  {provider.user.firstName} {provider.user.lastName} ·{" "}
                  {provider.user.email}
                </CardDescription>
              </div>
              <ProviderStatusBadge status={provider.status} />
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="License" value={provider.licenseNumber} />
              <DetailItem label="Resource" value={provider.resourceType} />
              <DetailItem
                label="Capacity"
                value={`${provider.capacityKw} kW`}
              />
              <DetailItem label="Contact person" value={provider.contactPerson} />
              <DetailItem label="Contact phone" value={provider.contactPhone} />
              <DetailItem label="Address" value={provider.address} />
              <DetailItem
                label="Bank account"
                value={provider.bankAccountNumber ?? "Not provided"}
              />
              <DetailItem
                label="Email verified"
                value={provider.user.emailVerified ? "Yes" : "No"}
              />
              {provider.rejectionReason ? (
                <DetailItem
                  label="Rejection reason"
                  value={provider.rejectionReason}
                />
              ) : null}
            </CardContent>
          </Card>

          {canApprove(provider.status) || canReject(provider.status) ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {canApprove(provider.status) ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Approve</CardTitle>
                    <CardDescription>
                      Sets status to APPROVED and marks the provider verified.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="button"
                      disabled={approve.isPending}
                      onClick={() => {
                        approve.mutate(
                          { providerId: provider.id },
                          {
                            onSuccess: () => {
                              toast.add({
                                title: "Provider approved",
                                description: "Status is now APPROVED.",
                                type: "success",
                              });
                            },
                            onError: (error) => {
                              toast.add({
                                title: "Could not approve provider",
                                description: getApiErrorMessage(
                                  error,
                                  "Try again.",
                                ),
                                type: "error",
                              });
                            },
                          },
                        );
                      }}
                    >
                      {approve.isPending ? "Approving…" : "Approve provider"}
                    </Button>
                  </CardContent>
                </Card>
              ) : null}

              {canReject(provider.status) ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Reject</CardTitle>
                    <CardDescription>
                      Requires a reason. Rejected providers cannot re-apply
                      through the API.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RejectProviderForm providerId={provider.id} />
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium break-words">{value}</p>
    </div>
  );
}
