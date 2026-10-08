import Link from "next/link";
import {
  Building2,
  CalendarClock,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

import { HeroVisual } from "@/components/modules/marketing/hero-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-static";

const steps = [
  {
    title: "Event published",
    detail: "An operator schedules an outage window with total capacity.",
  },
  {
    title: "Request or offer",
    detail: "Consumers request kW. Approved providers publish priced offers.",
  },
  {
    title: "Allocation",
    detail: "The operator matches requests to offers within price and capacity.",
  },
  {
    title: "Pay and deliver",
    detail: "Pay with bKash, then confirm delivery when power is supplied.",
  },
] as const;

const outcomes = [
  {
    icon: Zap,
    title: "Capacity when the grid is down",
    detail: "Reserve backup kilowatts for a known outage window—not standing contracts.",
  },
  {
    icon: Wallet,
    title: "Priced per kWh",
    detail: "See offer prices before you reserve. Settle in BDT with bKash.",
  },
  {
    icon: ShieldCheck,
    title: "Audited matching",
    detail: "Operators allocate against rules. Admins keep a full audit trail.",
  },
] as const;

const faqs = [
  {
    q: "How do I pay?",
    a: "After allocation, open your reservation and start bKash checkout. You return to PowerMesh with the payment status.",
  },
  {
    q: "Who can become a provider?",
    a: "Apply with company and capacity details. An operator reviews and approves before you can publish offers.",
  },
  {
    q: "Can I request twice for the same event?",
    a: "One capacity request per consumer per event. You can edit or cancel while it is still pending.",
  },
  {
    q: "What if delivery falls short?",
    a: "Confirm partial delivery or dispute from the delivery page. Shortfalls can open an incident and local refund record.",
  },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
      <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-12">
        <div>
          <Badge variant="secondary" className="w-fit">
            Backup power marketplace
          </Badge>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Capacity for the hours the grid is down.
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground text-pretty sm:text-lg">
            PowerMesh matches consumers who need backup kilowatts with approved
            providers for a scheduled outage event in Bangladesh.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link href="/register" />}>
              Get backup power
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/login" />}
            >
              Sign in
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Supplying capacity?{" "}
            <Link
              href="/register/provider"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Apply as a provider
            </Link>
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-3.5" />
              Scheduled events
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              Licensed providers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="size-3.5" />
              bKash settlement
            </span>
          </div>
        </div>
        <HeroVisual />
      </section>

      <Separator />

      <section id="how-it-works" className="scroll-mt-20 py-14 sm:py-16">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
          One loop from outage window to delivered kilowatts.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-border/70 bg-card p-4 shadow-sm"
            >
              <p className="text-xs font-medium text-muted-foreground">
                Step {index + 1}
              </p>
              <p className="mt-2 font-semibold tracking-tight">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-14 sm:pb-16">
        <h2 className="text-2xl font-semibold tracking-tight">Who it is for</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
          Join as a consumer or provider. Operator and admin desks are invited.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Consumers</CardTitle>
              <CardDescription>
                Request backup kilowatts for an outage window, reserve an offer,
                pay, and confirm delivery.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Providers</CardTitle>
              <CardDescription>
                Apply with your company and capacity. Once approved, publish
                offers and fulfill allocated reservations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Operators schedule events and run allocation. Admins manage users and
          audit history—both are provisioned, not self-serve.
        </p>
      </section>

      <section className="pb-14 sm:pb-16">
        <h2 className="text-2xl font-semibold tracking-tight">What you get</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {outcomes.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="size-5 text-muted-foreground" />
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.detail}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 pb-16 sm:pb-20">
        <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
        <div className="mt-6 divide-y divide-border rounded-xl border border-border/70">
          {faqs.map((item) => (
            <Collapsible key={item.q} className="px-4 py-3">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left text-sm font-medium">
                {item.q}
                <span className="text-muted-foreground">+</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 text-sm text-muted-foreground text-pretty">
                {item.a}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </section>
    </main>
  );
}
