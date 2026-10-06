import Link from "next/link";

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
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Register as a consumer. First and last name must be 3 to 10
            characters. A 6-digit code confirms the email.
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
    </main>
  );
}
