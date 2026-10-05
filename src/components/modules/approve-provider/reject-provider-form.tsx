"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useRejectProvider } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  rejectProviderSchema,
  type RejectProviderValues,
} from "@/validation/provider";
import { cn } from "@/lib/utils";

export function RejectProviderForm({
  providerId,
  onRejected,
}: {
  providerId: string;
  onRejected?: () => void;
}) {
  const reject = useRejectProvider();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectProviderValues>({
    resolver: zodResolver(rejectProviderSchema),
    defaultValues: { rejectionReason: "" },
  });

  return (
    <form
      className="space-y-3"
      noValidate
      onSubmit={handleSubmit((values) => {
        reject.mutate(
          { providerId, rejectionReason: values.rejectionReason },
          {
            onSuccess: () => {
              toast.add({
                title: "Provider rejected",
                description:
                  "Status is now REJECTED. There is no re-apply API for this account.",
                type: "success",
              });
              reset();
              onRejected?.();
            },
            onError: (error) => {
              toast.add({
                title: "Could not reject provider",
                description: getApiErrorMessage(error, "Try again."),
                type: "error",
              });
            },
          },
        );
      })}
    >
      <div className="space-y-2">
        <Label htmlFor={`reject-reason-${providerId}`}>Rejection reason</Label>
        <textarea
          id={`reject-reason-${providerId}`}
          rows={4}
          aria-invalid={Boolean(errors.rejectionReason)}
          className={cn(
            "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          )}
          placeholder="Explain why this application is rejected (3–500 characters)."
          {...register("rejectionReason")}
        />
        {errors.rejectionReason ? (
          <p className="text-sm text-destructive">
            {errors.rejectionReason.message}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Rejection is final. The API does not offer a provider re-apply path.
          </p>
        )}
      </div>
      <Button
        type="submit"
        variant="destructive"
        disabled={reject.isPending}
      >
        {reject.isPending ? "Rejecting…" : "Reject provider"}
      </Button>
    </form>
  );
}
