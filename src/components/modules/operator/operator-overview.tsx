"use client";

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  Scale,
} from "lucide-react";

import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const desks = [
  {
    title: "Events",
    detail: "Create and advance outage windows through their lifecycle.",
    href: "/operator/events",
    icon: CalendarDays,
  },
  {
    title: "Providers",
    detail: "Review applications and approve companies to publish capacity.",
    href: "/operator/providers",
    icon: Building2,
  },
  {
    title: "Allocation",
    detail: "Preview matching, then approve to create reservations.",
    href: "/operator/allocation",
    icon: Scale,
  },
  {
    title: "Requests",
    detail: "Monitor consumer capacity requests across your events.",
    href: "/operator/requests",
    icon: ClipboardList,
  },
] as const;

export function OperatorOverview() {
  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Home"
        description="Schedule outages, approve providers, and run allocation from these desks."
        actions={
          <Button size="sm" render={<Link href="/operator/events/new" />}>
            Create event
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {desks.map((desk) => (
          <Card key={desk.href} className="transition-colors hover:bg-muted/30">
            <CardHeader>
              <desk.icon className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">
                <Link href={desk.href} className="hover:underline">
                  {desk.title}
                </Link>
              </CardTitle>
              <CardDescription>{desk.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
