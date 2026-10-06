import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-static";

const roles = [
  {
    name: "Consumer",
    detail: "Request backup kilowatts for an outage window.",
  },
  {
    name: "Provider",
    detail: "Offer approved capacity at a price per kWh.",
  },
  {
    name: "Operator",
    detail: "Schedule events and run allocation.",
  },
  {
    name: "Admin",
    detail: "Manage users, audit history, and platform stats.",
  },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16 sm:py-24">
      <Badge variant="secondary" className="w-fit">
        Backup power marketplace
      </Badge>
      <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Capacity for the hours the grid is down.
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground text-pretty sm:text-lg">
        PowerMesh matches consumers who need backup kilowatts with providers who
        can supply them, for a scheduled outage event.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" render={<Link href="/login" />}>
          Sign in
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/register" />}>
          Create an account
        </Button>
        <Button
          size="lg"
          variant="secondary"
          render={<Link href="/register/provider" />}
        >
          Apply as a provider
        </Button>
      </div>
      <Separator className="my-12" />
      <div className="grid gap-4 sm:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <CardTitle>{role.name}</CardTitle>
              <CardDescription>{role.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
