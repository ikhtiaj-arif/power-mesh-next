"use client";

import Image from "next/image";
import { useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useUpdateProfilePicture } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { User } from "@/types";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function ProfilePictureUpload({ user }: { user: User }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUpdateProfilePicture();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile photo</CardTitle>
        <CardDescription>
          JPEG, PNG, WEBP, or AVIF. Uploaded images are stored on Cloudinary.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-6">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <Avatar className="size-24" data-size="lg">
              <AvatarImage src={undefined} alt="" />
              <AvatarFallback className="text-lg">
                {initials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) {
                return;
              }

              if (!ALLOWED_TYPES.has(file.type)) {
                toast.add({
                  title: "Unsupported file type",
                  description:
                    "Only JPEG, PNG, WEBP and AVIF images are allowed.",
                  type: "error",
                });
                return;
              }

              upload.mutate(file, {
                onSuccess: () => {
                  toast.add({
                    title: "Photo updated",
                    description: "Your profile picture was uploaded.",
                    type: "success",
                  });
                },
                onError: (error) => {
                  toast.add({
                    title: "Upload failed",
                    description: getApiErrorMessage(error, "Try again."),
                    type: "error",
                  });
                },
              });
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={upload.isPending}
            onClick={() => inputRef.current?.click()}
          >
            {upload.isPending ? "Uploading…" : "Choose image"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
