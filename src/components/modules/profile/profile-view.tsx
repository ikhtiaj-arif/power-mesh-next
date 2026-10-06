"use client";

import { useState } from "react";

import { ProviderStatusBadge } from "@/components/modules/approve-provider/provider-status-badge";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { ProfileEditForm } from "@/components/modules/profile/profile-edit-form";
import { ProfilePictureUpload } from "@/components/modules/profile/profile-picture-upload";
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
import { useGetMe } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { getRoleLabel } from "@/routes";
import type { ProviderStatus } from "@/types";

function EmptyValue() {
  return (
    <span className="font-normal text-muted-foreground italic">Not set</span>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    String(value).trim().length > 0;

  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium break-words">
        {hasValue ? value : <EmptyValue />}
      </p>
    </div>
  );
}

export function ProfileView() {
  const me = useGetMe();
  const [editing, setEditing] = useState(false);
  const user = me.data?.data;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Profile"
        description="Your account identity and role-specific details from the live API."
        rangeLabel="Account"
      />

      {me.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : null}

      {me.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(me.error, "Could not load your profile.")}
        </p>
      ) : null}

      {user ? (
        <>
          {!editing ? (
            <>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" size="sm" onClick={() => setEditing(true)}>
                  Edit profile
                </Button>
              </div>

              <ProfilePictureUpload user={user} />

              <Card>
                <CardHeader>
                  <CardTitle>Identity</CardTitle>
                  <CardDescription>
                    {user.email} · {getRoleLabel(user.role)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <DetailItem
                    label="Name"
                    value={`${user.firstName} ${user.lastName}`}
                  />
                  <DetailItem label="Email" value={user.email} />
                  <DetailItem label="Role" value={getRoleLabel(user.role)} />
                  <DetailItem label="Account status" value={user.status} />
                  <DetailItem
                    label="Email verified"
                    value={user.emailVerified ? "Yes" : "No"}
                  />
                  <DetailItem label="Sign-in method" value={user.authProvider} />
                </CardContent>
              </Card>

              {user.consumer ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Consumer profile</CardTitle>
                    <CardDescription>
                      Organization and load details used for capacity requests.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    <DetailItem
                      label="Organization"
                      value={user.consumer.organizationName}
                    />
                    <DetailItem
                      label="Critical load"
                      value={
                        user.consumer.criticalLoadKw
                          ? `${user.consumer.criticalLoadKw} kW`
                          : null
                      }
                    />
                    <DetailItem label="Address" value={user.consumer.address} />
                    <DetailItem
                      label="Contact person"
                      value={user.consumer.contactPerson}
                    />
                    <DetailItem
                      label="Contact phone"
                      value={user.consumer.contactPhone}
                    />
                  </CardContent>
                </Card>
              ) : null}

              {user.provider ? (
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between gap-3">
                    <div>
                      <CardTitle>Provider profile</CardTitle>
                      <CardDescription>
                        Company, resource, and approval status.
                      </CardDescription>
                    </div>
                    <ProviderStatusBadge
                      status={user.provider.status as ProviderStatus}
                    />
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    <DetailItem
                      label="Company"
                      value={user.provider.companyName}
                    />
                    <DetailItem
                      label="Resource type"
                      value={user.provider.resourceType}
                    />
                    <DetailItem
                      label="Capacity"
                      value={
                        user.provider.capacityKw
                          ? `${user.provider.capacityKw} kW`
                          : null
                      }
                    />
                    <DetailItem
                      label="License"
                      value={user.provider.licenseNumber}
                    />
                    <DetailItem label="Address" value={user.provider.address} />
                    <DetailItem
                      label="Contact person"
                      value={user.provider.contactPerson}
                    />
                    <DetailItem
                      label="Contact phone"
                      value={user.provider.contactPhone}
                    />
                    <DetailItem
                      label="Bank account"
                      value={user.provider.bankAccountNumber}
                    />
                    <DetailItem
                      label="Verified"
                      value={user.provider.verified ? "Yes" : "No"}
                    />
                    {user.provider.rejectionReason ? (
                      <DetailItem
                        label="Rejection reason"
                        value={user.provider.rejectionReason}
                      />
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}

              {user.operator ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Operator access</CardTitle>
                    <CardDescription>
                      Desk permissions for operations staff.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-2">
                    <DetailItem
                      label="Admin privileges"
                      value={user.operator.isAdmin ? "Yes" : "No"}
                    />
                    {user.operator.isAdmin ? (
                      <Badge variant="secondary">Admin operator</Badge>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}
            </>
          ) : (
            <>
              <ProfilePictureUpload user={user} />
              <ProfileEditForm
                user={user}
                onCancel={() => setEditing(false)}
                onSaved={() => setEditing(false)}
              />
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
