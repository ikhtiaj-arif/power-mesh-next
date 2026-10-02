"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegistration, useVerifyAccount } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type { RegisterConsumerPayload } from "@/types";
import {
  registerSchema,
  verifyEmailSchema,
  type RegisterValues,
} from "@/validation/auth";

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function RegisterForm() {
  const router = useRouter();
  const registration = useRegistration();
  const verification = useVerifyAccount();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      organizationName: "",
      criticalLoadKw: "",
      address: "",
      contactPerson: "",
      contactPhone: "",
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
              onSuccess: () => {
                router.push("/");
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
            {getApiErrorMessage(verification.error, "Could not verify the code.")}
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
        const criticalLoadKw = optionalText(values.criticalLoadKw);
        const payload: RegisterConsumerPayload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          consumer: {
            organizationName: optionalText(values.organizationName),
            criticalLoadKw:
              criticalLoadKw === undefined ? undefined : Number(criticalLoadKw),
            address: optionalText(values.address),
            contactPerson: optionalText(values.contactPerson),
            contactPhone: optionalText(values.contactPhone),
          },
        };

        registration.mutate(payload, {
          onSuccess: (response) => {
            setPendingEmail(values.email.trim().toLowerCase());
            setDevOtp(response.data.otp ?? null);
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
        <legend className="text-sm font-medium">Organization details</legend>
        <p className="text-sm text-muted-foreground">
          Optional. You can leave these blank.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="organizationName">Organization</Label>
          <Input id="organizationName" {...register("organizationName")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="criticalLoadKw">Critical load (kW)</Label>
          <Input
            id="criticalLoadKw"
            inputMode="decimal"
            aria-invalid={Boolean(errors.criticalLoadKw)}
            {...register("criticalLoadKw")}
          />
          {errors.criticalLoadKw ? (
            <p className="text-sm text-destructive">{errors.criticalLoadKw.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" autoComplete="street-address" {...register("address")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactPerson">Contact person</Label>
          <Input id="contactPerson" {...register("contactPerson")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactPhone">Contact phone</Label>
          <Input
            id="contactPhone"
            type="tel"
            autoComplete="tel"
            {...register("contactPhone")}
          />
        </div>
      </fieldset>
      {registration.error ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(registration.error, "Could not create the account.")}
        </p>
      ) : null}
      <Button type="submit" className="mt-2" disabled={registration.isPending}>
        {registration.isPending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
