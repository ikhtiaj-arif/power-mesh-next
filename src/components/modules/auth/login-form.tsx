"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { DemoLoginButtons } from "@/components/modules/auth/demo-login-buttons";
import { GoogleSignInButton } from "@/components/modules/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useGoogleLogin, useGoToRoleHome, useLogin } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { loginSchema, type LoginValues } from "@/validation/auth";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function LoginForm() {
  const goToRoleHome = useGoToRoleHome();
  const login = useLogin();
  const googleLogin = useGoogleLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const errorMessage = login.error
    ? getApiErrorMessage(login.error, "Could not sign in.")
    : googleLogin.error
      ? getApiErrorMessage(googleLogin.error, "Could not sign in with Google.")
      : null;

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={handleSubmit((values) => {
        login.mutate(values, {
          onSuccess: async () => {
            toast.add({
              title: "Signed in",
              description: "Welcome back.",
              type: "success",
            });
            await goToRoleHome();
          },
          onError: (error) => {
            toast.add({
              title: "Could not sign in",
              description: getApiErrorMessage(error, "Check your email and password."),
              type: "error",
            });
          },
        });
      })}
    >
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
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <Button type="submit" className="mt-2" disabled={login.isPending}>
        {login.isPending ? "Signing in..." : "Sign in"}
      </Button>
      {googleClientId ? (
        <GoogleSignInButton
          disabled={googleLogin.isPending || login.isPending}
          onSuccess={(idToken) => {
            googleLogin.mutate(
              { idToken },
              {
                onSuccess: async () => {
                  toast.add({
                    title: "Signed in",
                    description: "Welcome back.",
                    type: "success",
                  });
                  await goToRoleHome();
                },
                onError: (error) => {
                  toast.add({
                    title: "Could not sign in with Google",
                    description: getApiErrorMessage(error, "Try again."),
                    type: "error",
                  });
                },
              },
            );
          }}
          onError={() => {
            googleLogin.reset();
          }}
        />
      ) : (
        <p className="text-xs text-muted-foreground">
          Google sign-in is hidden until `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set.
        </p>
      )}
      <DemoLoginButtons />
      <p className="text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
