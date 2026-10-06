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
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Apply as a provider</CardTitle>
          <CardDescription>
            Submit your company and capacity details. A 6-digit code confirms
            your email, then an operator reviews the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderApplyForm />
        </CardContent>
      </Card>
    </main>
  );
}
