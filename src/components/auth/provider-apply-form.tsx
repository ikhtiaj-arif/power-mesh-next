"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useApplyAsProvider, useVerifyProviderEmail } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import type { ApplyAsProviderPayload } from "@/types";
import {
  providerApplySchema,
  resourceTypes,
  verifyEmailSchema,
  type ProviderApplyValues,
} from "@/validation/auth";

const resourceTypeLabels: Record<(typeof resourceTypes)[number], string> = {
  GENERATOR: "Generator",
  SOLAR_BESS: "Solar + BESS",
  BATTERY: "Battery",
  MICROGRID: "Microgrid",
  OTHER: "Other",
};

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function ProviderApplyForm() {
  const router = useRouter();
  const apply = useApplyAsProvider();
  const verification = useVerifyProviderEmail();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderApplyValues>({
    resolver: zodResolver(providerApplySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
      licenseNumber: "",
      resourceType: "GENERATOR",
      capacityKw: "",
      address: "",
      contactPerson: "",
      contactPhone: "",
      bankAccountNumber: "",
    },
  });
  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { otp: "" },
  });

  if (pendingEmail) {
    return (
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={otpForm.handleSubmit((values) => {
          verification.mutate(
            { email: pendingEmail, otp: values.otp },
            {
              onSuccess: (response) => {
                toast.add({
                  title: "Email verified",
                  description:
                    response.message ||
                    "Your application is pending approval.",
                  type: "success",
                });
                router.push("/");
              },
              onError: (error) => {
                toast.add({
                  title: "Could not verify the code",
                  description: getApiErrorMessage(
                    error,
                    "Check the code and try again.",
                  ),
                  type: "error",
                });
              },
            },
          );
        })}
      >
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to {pendingEmail}.
        </p>
        {devOtp ? (
          <p className="text-sm text-muted-foreground" role="status">
            Email delivery is unavailable. Use this code: {devOtp}
          </p>
        ) : null}
        <div className="flex flex-col gap-2">
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            aria-invalid={Boolean(otpForm.formState.errors.otp)}
            {...otpForm.register("otp")}
          />
          {otpForm.formState.errors.otp ? (
            <p className="text-sm text-destructive">
              {otpForm.formState.errors.otp.message}
            </p>
          ) : null}
        </div>
        {verification.error ? (
          <p className="text-sm text-destructive" role="alert">
            {getApiErrorMessage(
              verification.error,
              "Could not verify the code.",
            )}
          </p>
        ) : null}
        <Button type="submit" disabled={verification.isPending}>
          {verification.isPending ? "Verifying..." : "Verify email"}
        </Button>
      </form>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={handleSubmit((values) => {
        const payload: ApplyAsProviderPayload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          provider: {
            companyName: values.companyName,
            licenseNumber: values.licenseNumber,
            resourceType: values.resourceType,
            capacityKw: Number(values.capacityKw),
            address: values.address,
            contactPerson: values.contactPerson,
            contactPhone: values.contactPhone,
            bankAccountNumber: optionalText(values.bankAccountNumber),
          },
        };

        apply.mutate(payload, {
          onSuccess: (response) => {
            setPendingEmail(values.email.trim().toLowerCase());
            setDevOtp(response.data.otp ?? null);
            toast.add({
              title: "Check your email",
              description: response.message
                ? response.message
                : response.data.emailSent
                  ? "Enter the 6-digit code we sent you."
                  : "Email delivery is unavailable. Use the code shown on this page.",
              type: "success",
            });
          },
          onError: (error) => {
            toast.add({
              title: "Could not submit the application",
              description: getApiErrorMessage(error, "Try again."),
              type: "error",
            });
          },
        });
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.firstName)}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.lastName)}
            {...register("lastName")}
          />
          {errors.lastName ? (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-medium">Provider details</legend>
        <div className="flex flex-col gap-2">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            aria-invalid={Boolean(errors.companyName)}
            {...register("companyName")}
          />
          {errors.companyName ? (
            <p className="text-sm text-destructive">{errors.companyName.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="licenseNumber">License number</Label>
          <Input
            id="licenseNumber"
            aria-invalid={Boolean(errors.licenseNumber)}
            {...register("licenseNumber")}
          />
          {errors.licenseNumber ? (
            <p className="text-sm text-destructive">
              {errors.licenseNumber.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="resourceType">Resource type</Label>
            <select
              id="resourceType"
              aria-invalid={Boolean(errors.resourceType)}
              className={cn(
                "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
              )}
              {...register("resourceType")}
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {resourceTypeLabels[type]}
                </option>
              ))}
            </select>
            {errors.resourceType ? (
              <p className="text-sm text-destructive">
                {errors.resourceType.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="capacityKw">Capacity (kW)</Label>
            <Input
              id="capacityKw"
              inputMode="numeric"
              aria-invalid={Boolean(errors.capacityKw)}
              {...register("capacityKw")}
            />
            {errors.capacityKw ? (
              <p className="text-sm text-destructive">
                {errors.capacityKw.message}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            autoComplete="street-address"
            aria-invalid={Boolean(errors.address)}
            {...register("address")}
          />
          {errors.address ? (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contactPerson">Contact person</Label>
            <Input
              id="contactPerson"
              aria-invalid={Boolean(errors.contactPerson)}
              {...register("contactPerson")}
            />
            {errors.contactPerson ? (
              <p className="text-sm text-destructive">
                {errors.contactPerson.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              autoComplete="tel"
              aria-invalid={Boolean(errors.contactPhone)}
              {...register("contactPhone")}
            />
            {errors.contactPhone ? (
              <p className="text-sm text-destructive">
                {errors.contactPhone.message}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bankAccountNumber">Bank account number</Label>
          <Input
            id="bankAccountNumber"
            {...register("bankAccountNumber")}
          />
          <p className="text-sm text-muted-foreground">Optional.</p>
        </div>
      </fieldset>
      {apply.error ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(apply.error, "Could not submit the application.")}
        </p>
      ) : null}
      <Button type="submit" className="mt-2" disabled={apply.isPending}>
        {apply.isPending ? "Submitting..." : "Apply as provider"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Looking for consumer access?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create a consumer account
        </Link>
      </p>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
