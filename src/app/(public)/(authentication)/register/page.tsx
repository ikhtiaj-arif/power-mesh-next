import Link from "next/link";

import { AuthSidePanel } from "@/components/modules/marketing/auth-side-panel";
import { RegisterForm } from "@/components/modules/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-static";

export default function RegisterPage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:py-16">
      <Card className="w-full max-w-md justify-self-center lg:justify-self-start">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Register as a consumer. We email a 6-digit code to confirm your
            address, then you can browse outage events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-sm text-muted-foreground">
            Supplying backup power?{" "}
            <Link
              href="/register/provider"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Apply as a provider
            </Link>
          </p>
        </CardContent>
      </Card>
      <AuthSidePanel
        title="Your next step after signup"
        bullets={[
          "Confirm your email with the 6-digit code.",
          "Browse scheduled outage windows.",
          "Request capacity and reserve an offer when ready.",
        ]}
      />
    </main>
  );
}
