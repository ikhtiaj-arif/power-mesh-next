import Link from "next/link";

import { AuthSidePanel } from "@/components/modules/marketing/auth-side-panel";
import { ProviderApplyForm } from "@/components/modules/auth/provider-apply-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-static";

export default function ProviderRegisterPage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 items-start gap-10 px-6 py-12 lg:grid-cols-2 lg:py-16">
      <Card className="w-full max-w-lg justify-self-center lg:justify-self-start">
        <CardHeader>
          <CardTitle>Apply as a provider</CardTitle>
          <CardDescription>
            Submit company and capacity details. Confirm your email, then an
            operator reviews the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderApplyForm />
          <p className="mt-4 text-sm text-muted-foreground">
            Looking for consumer access?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create a consumer account
            </Link>
          </p>
        </CardContent>
      </Card>
      <AuthSidePanel
        title="Provider onboarding"
        bullets={[
          "Verify email with a 6-digit code.",
          "Wait for operator approval of your company.",
          "Publish offers for open outage events.",
        ]}
      />
    </main>
  );
}
