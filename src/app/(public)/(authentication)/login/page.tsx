import { AuthSidePanel } from "@/components/modules/marketing/auth-side-panel";
import { LoginForm } from "@/components/modules/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:py-16">
      <Card className="w-full max-w-md justify-self-center lg:justify-self-start">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Use your PowerMesh account to open your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <AuthSidePanel />
    </main>
  );
}
