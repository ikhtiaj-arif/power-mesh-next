"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
import { toast } from "@/components/ui/toast";
import {
  useBlockAdminUser,
  useGetAdminUserById,
  useSoftDeleteAdminUser,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  blockUserSchema,
  type BlockUserValues,
} from "@/validation/admin";

export function AdminUserDetail({
  userId,
  embedded = false,
}: {
  userId: string;
  /** Hide page chrome when rendered inside a preview sheet. */
  embedded?: boolean;
}) {
  const detail = useGetAdminUserById(userId);
  const user = detail.data;
  const block = useBlockAdminUser(userId);
  const softDelete = useSoftDeleteAdminUser(userId);
  const [blockOpen, setBlockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<BlockUserValues>({
    resolver: zodResolver(blockUserSchema),
    defaultValues: { reason: "" },
  });

  const isBlocked = user?.status === "BLOCKED";

  function toggleBlock() {
    if (!user) {
      return;
    }
    if (!isBlocked) {
      setBlockOpen(true);
      return;
    }

    block.mutate(
      { isBlocked: false },
      {
        onSuccess: () => {
          toast.add({ title: "User unblocked", type: "success" });
          reset({ reason: "" });
        },
        onError: (error) => {
          toast.add({
            title: "Action failed",
            description: getApiErrorMessage(error, "Could not update user."),
            type: "error",
          });
        },
      },
    );
  }

  function confirmBlock() {
    return new Promise<void>((resolve, reject) => {
      void handleSubmit((values) => {
        block.mutate(
          {
            isBlocked: true,
            ...(values.reason?.trim() ? { reason: values.reason.trim() } : {}),
          },
          {
            onSuccess: () => {
              toast.add({ title: "User blocked", type: "success" });
              resolve();
            },
            onError: (error) => {
              toast.add({
                title: "Action failed",
                description: getApiErrorMessage(error, "Could not update user."),
                type: "error",
              });
              reject(error);
            },
          },
        );
      })();
      // Ensure form validation failure does not hang the dialog action.
      if (Object.keys(errors).length > 0 && !getValues("reason")) {
        // no-op; handleSubmit already surfaces field errors
      }
    });
  }

  function confirmSoftDelete() {
    return new Promise<void>((resolve, reject) => {
      softDelete.mutate(undefined, {
        onSuccess: () => {
          toast.add({ title: "User deleted", type: "success" });
          resolve();
        },
        onError: (error) => {
          toast.add({
            title: "Delete failed",
            description: getApiErrorMessage(error, "Could not delete user."),
            type: "error",
          });
          reject(error);
        },
      });
    });
  }

  return (
    <div className="space-y-6">
      {embedded ? null : (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <OverviewHeader
            title="User detail"
            description="Identity and moderation actions. Passwords are never shown."
          />
          <Button variant="outline" size="sm" render={<Link href="/admin/users" />}>
            Back to users
          </Button>
        </div>
      )}

      {detail.isPending ? <Skeleton className="h-40 w-full rounded-xl" /> : null}

      {detail.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(detail.error, "Could not load user.")}
        </p>
      ) : null}

      {user ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
              <Detail label="Role" value={user.role} />
              <Detail label="Status">
                <Badge variant="outline">{user.status}</Badge>
              </Detail>
              <Detail label="Active" value={user.isActive ? "Yes" : "No"} />
              <Detail label="Email verified" value={user.emailVerified ? "Yes" : "No"} />
              {user.provider ? (
                <Detail label="Provider status" value={user.provider.status} />
              ) : null}
              {user.consumer?.organizationName ? (
                <Detail label="Organization" value={user.consumer.organizationName} />
              ) : null}
            </CardContent>
          </Card>

          {user.role !== "ADMIN" ? (
            <Card>
              <CardHeader>
                <CardTitle>Moderation</CardTitle>
                <CardDescription>
                  Admins cannot be blocked or soft-deleted from this UI; the API returns forbidden.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isBlocked ? (
                  <div className="max-w-md space-y-1">
                    <Label htmlFor="block-reason">Block reason (optional, max 500)</Label>
                    <Input
                      id="block-reason"
                      maxLength={500}
                      {...register("reason")}
                    />
                    {errors.reason ? (
                      <p className="text-sm text-destructive">{errors.reason.message}</p>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={isBlocked ? "outline" : "destructive"}
                    disabled={block.isPending || user.status === "DELETED"}
                    onClick={toggleBlock}
                  >
                    {block.isPending
                      ? "Saving…"
                      : isBlocked
                        ? "Unblock user"
                        : "Block user"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={softDelete.isPending || user.isDeleted}
                    onClick={() => setDeleteOpen(true)}
                  >
                    {softDelete.isPending ? "Deleting…" : "Delete user"}
                  </Button>
                </div>
                <ConfirmDialog
                  open={blockOpen}
                  onOpenChange={setBlockOpen}
                  title="Block this user?"
                  description="They will not be able to use the platform while blocked."
                  confirmLabel="Block user"
                  variant="destructive"
                  loading={block.isPending}
                  onConfirm={confirmBlock}
                />
                <ConfirmDialog
                  open={deleteOpen}
                  onOpenChange={setDeleteOpen}
                  title="Delete this account?"
                  description="The account is marked deleted. This cannot be undone from here."
                  confirmLabel="Delete user"
                  variant="destructive"
                  loading={softDelete.isPending}
                  onConfirm={confirmSoftDelete}
                />
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">
              Admin accounts cannot be blocked or soft-deleted.
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}

function Detail({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <div className="font-medium">{children ?? value ?? "—"}</div>
    </div>
  );
}
