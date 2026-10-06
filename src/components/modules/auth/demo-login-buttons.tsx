"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGoToRoleHome, useLogin } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";

const DEMO_ACCOUNTS = [
  {
    role: "Consumer",
    email: "consumer@powermesh.com",
    password: "Consumer@123",
    note: null,
  },
  {
    role: "Provider",
    email: "provider@powermesh.com",
    password: "Provider@123",
    note: "Seeded provider is not approved for offer create.",
  },
  {
    role: "Operator",
    email: "operator@powermesh.com",
    password: "Operator@123",
    note: null,
  },
  {
    role: "Admin",
    email: "admin@powermesh.com",
    password: "Admin@123",
    note: null,
  },
] as const;

const demoLoginEnabled = process.env.NEXT_PUBLIC_DEMO_LOGIN === "true";

export function DemoLoginButtons() {
  const login = useLogin();
  const goToRoleHome = useGoToRoleHome();

  if (!demoLoginEnabled) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-border p-3">
      <div>
        <p className="text-sm font-medium">Development demo login</p>
        <p className="text-xs text-muted-foreground">
          Uses seeded accounts. Development only — never enable in production.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {DEMO_ACCOUNTS.map((account) => (
          <Button
            key={account.email}
            type="button"
            variant="outline"
            size="sm"
            disabled={login.isPending}
            onClick={() => {
              login.mutate(
                { email: account.email, password: account.password },
                {
                  onSuccess: async () => {
                    toast.add({
                      title: `Signed in as ${account.role}`,
                      description:
                        account.note ?? "Welcome back (development seed).",
                      type: "success",
                    });
                    await goToRoleHome();
                  },
                  onError: (error) => {
                    toast.add({
                      title: "Demo login failed",
                      description: getApiErrorMessage(
                        error,
                        "Could not sign in with the seed account.",
                      ),
                      type: "error",
                    });
                  },
                },
              );
            }}
          >
            {account.role}
          </Button>
        ))}
      </div>
    </div>
  );
}
