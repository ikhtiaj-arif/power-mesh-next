"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useUpdateMe } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { UpdateMePayload, User } from "@/types";
import {
  profileEditSchema,
  type ProfileEditValues,
} from "@/validation/profile";

function defaultValuesFromUser(user: User): ProfileEditValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    organizationName: user.consumer?.organizationName ?? "",
    criticalLoadKw: user.consumer?.criticalLoadKw,
    address: user.consumer?.address ?? "",
    contactPerson: user.consumer?.contactPerson ?? "",
    contactPhone: user.consumer?.contactPhone ?? "",
    companyName: user.provider?.companyName ?? "",
    providerAddress: user.provider?.address ?? "",
    providerContactPerson: user.provider?.contactPerson ?? "",
    providerContactPhone: user.provider?.contactPhone ?? "",
    bankAccountNumber: user.provider?.bankAccountNumber ?? "",
  };
}

function buildChangedPayload(
  user: User,
  values: ProfileEditValues,
): UpdateMePayload | null {
  const payload: UpdateMePayload = {};

  if (values.firstName !== user.firstName) {
    payload.firstName = values.firstName;
  }
  if (values.lastName !== user.lastName) {
    payload.lastName = values.lastName;
  }

  if (user.consumer) {
    const consumer: NonNullable<UpdateMePayload["consumer"]> = {};
    const org = values.organizationName?.trim() ?? "";
    if (org !== (user.consumer.organizationName ?? "")) {
      consumer.organizationName = org;
    }
    const load = values.criticalLoadKw;
    if (
      load !== undefined &&
      load !== user.consumer.criticalLoadKw
    ) {
      consumer.criticalLoadKw = load;
    }
    const address = values.address?.trim() ?? "";
    if (address !== (user.consumer.address ?? "")) {
      consumer.address = address;
    }
    const contactPerson = values.contactPerson?.trim() ?? "";
    if (contactPerson !== (user.consumer.contactPerson ?? "")) {
      consumer.contactPerson = contactPerson;
    }
    const contactPhone = values.contactPhone?.trim() ?? "";
    if (contactPhone !== (user.consumer.contactPhone ?? "")) {
      consumer.contactPhone = contactPhone;
    }
    if (Object.keys(consumer).length > 0) {
      payload.consumer = consumer;
    }
  }

  if (user.provider) {
    const provider: NonNullable<UpdateMePayload["provider"]> = {};
    const companyName = values.companyName?.trim() ?? "";
    if (companyName !== (user.provider.companyName ?? "")) {
      provider.companyName = companyName;
    }
    const address = values.providerAddress?.trim() ?? "";
    if (address !== (user.provider.address ?? "")) {
      provider.address = address;
    }
    const contactPerson = values.providerContactPerson?.trim() ?? "";
    if (contactPerson !== (user.provider.contactPerson ?? "")) {
      provider.contactPerson = contactPerson;
    }
    const contactPhone = values.providerContactPhone?.trim() ?? "";
    if (contactPhone !== (user.provider.contactPhone ?? "")) {
      provider.contactPhone = contactPhone;
    }
    const bank = values.bankAccountNumber?.trim() ?? "";
    const existingBank = user.provider.bankAccountNumber ?? "";
    if (bank !== existingBank) {
      provider.bankAccountNumber = bank;
    }
    if (Object.keys(provider).length > 0) {
      payload.provider = provider;
    }
  }

  if (Object.keys(payload).length === 0) {
    return null;
  }

  return payload;
}

export function ProfileEditForm({
  user,
  onCancel,
  onSaved,
}: {
  user: User;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const update = useUpdateMe();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: defaultValuesFromUser(user),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>
          Update your name and role-specific contact details. Email, role, and
          password cannot be changed here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid max-w-xl gap-4"
          noValidate
          onSubmit={handleSubmit((values) => {
            const payload = buildChangedPayload(user, values);
            if (!payload) {
              toast.add({
                title: "No changes",
                description: "Update a field before saving.",
                type: "info",
              });
              return;
            }

            update.mutate(payload, {
              onSuccess: () => {
                toast.add({
                  title: "Profile saved",
                  description: "Your changes were applied.",
                  type: "success",
                });
                onSaved();
              },
              onError: (error) => {
                toast.add({
                  title: "Could not save profile",
                  description: getApiErrorMessage(error, "Try again."),
                  type: "error",
                });
              },
            });
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                aria-invalid={Boolean(errors.firstName)}
                {...register("firstName")}
              />
              {errors.firstName ? (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                aria-invalid={Boolean(errors.lastName)}
                {...register("lastName")}
              />
              {errors.lastName ? (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              ) : null}
            </div>
          </div>

          {user.consumer ? (
            <fieldset className="grid gap-4 rounded-lg border border-border p-4">
              <legend className="px-1 text-sm font-medium">
                Consumer details
              </legend>
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization</Label>
                <Input id="organizationName" {...register("organizationName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="criticalLoadKw">Critical load (kW)</Label>
                <Input
                  id="criticalLoadKw"
                  type="number"
                  min={1}
                  step={1}
                  aria-invalid={Boolean(errors.criticalLoadKw)}
                  {...register("criticalLoadKw", {
                    setValueAs: (value) =>
                      value === "" || value === null || value === undefined
                        ? undefined
                        : Number(value),
                  })}
                />
                {errors.criticalLoadKw ? (
                  <p className="text-sm text-destructive">
                    {errors.criticalLoadKw.message as string}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact person</Label>
                  <Input id="contactPerson" {...register("contactPerson")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact phone</Label>
                  <Input id="contactPhone" {...register("contactPhone")} />
                </div>
              </div>
            </fieldset>
          ) : null}

          {user.provider ? (
            <fieldset className="grid gap-4 rounded-lg border border-border p-4">
              <legend className="px-1 text-sm font-medium">
                Provider details
              </legend>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input id="companyName" {...register("companyName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="providerAddress">Address</Label>
                <Input id="providerAddress" {...register("providerAddress")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="providerContactPerson">Contact person</Label>
                  <Input
                    id="providerContactPerson"
                    {...register("providerContactPerson")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="providerContactPhone">Contact phone</Label>
                  <Input
                    id="providerContactPhone"
                    {...register("providerContactPhone")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Bank account</Label>
                <Input
                  id="bankAccountNumber"
                  {...register("bankAccountNumber")}
                />
              </div>
            </fieldset>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={update.isPending}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
