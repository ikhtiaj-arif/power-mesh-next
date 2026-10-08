"use client";

import Link from "next/link";

import { formatEventDate } from "@/components/modules/events/event-datetime";
import { EventStatusBadge } from "@/components/modules/events/event-status-badge";
import { OverviewHeader } from "@/components/modules/dashboard/overview-header";
import { StatCard } from "@/components/modules/dashboard/stat-card";
import { ProviderStatusBadge } from "@/components/modules/approve-provider/provider-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllProviders,
  useGetAllRequests,
  useGetMyEvents,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";

export function OperatorOverview() {
  const events = useGetMyEvents({ page: 1, limit: 20 });
  const providers = useGetAllProviders({
    page: 1,
    limit: 20,
    status: "PENDING_APPROVAL",
  });
  const requests = useGetAllRequests({ page: 1, limit: 20, status: "PENDING" });

  const eventRows = events.data?.data ?? [];
  const pendingProviders = providers.data?.data ?? [];
  const pendingRequests = requests.data?.data ?? [];

  const allocatable = eventRows.filter((event) =>
    ["SCHEDULED", "CONFIRMED"].includes(event.status),
  );
  const needingStatus = eventRows.filter((event) =>
    ["SCHEDULED", "CONFIRMED", "IN_PROGRESS"].includes(event.status),
  );

  const isLoading =
    events.isPending || providers.isPending || requests.isPending;
  const isError = events.isError || providers.isError || requests.isError;

  return (
    <div className="space-y-6">
      <OverviewHeader
        title="Home"
        description="Live work that needs an operator: providers, events, and requests."
        actions={
          <Button size="sm" render={<Link href="/operator/events/new" />}>
            Create event
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="My events"
            value={String(events.data?.meta?.total ?? eventRows.length)}
            description="Outage windows you operate"
          />
          <StatCard
            title="Pending providers"
            value={String(
              providers.data?.meta?.total ?? pendingProviders.length,
            )}
            description="Applications waiting for review"
          />
          <StatCard
            title="Pending requests"
            value={String(requests.data?.meta?.total ?? pendingRequests.length)}
            description="Consumer requests still open"
          />
          <StatCard
            title="Ready to allocate"
            value={String(allocatable.length)}
            description="Scheduled or confirmed on this page"
          />
        </div>
      )}

      {isError ? (
        <p className="text-sm text-destructive" role="alert">
          {getApiErrorMessage(
            events.error ?? providers.error ?? requests.error,
            "Could not load operator home.",
          )}
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Providers to review</CardTitle>
              <CardDescription>Pending approval applications</CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              render={<Link href="/operator/providers" />}
            >
              Queue
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingProviders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No providers waiting for approval.
              </p>
            ) : (
              pendingProviders.slice(0, 5).map((provider) => (
                <Link
                  key={provider.id}
                  href={`/operator/providers/${provider.id}`}
                  className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <span className="font-medium">{provider.companyName}</span>
                  <ProviderStatusBadge status={provider.status} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Events needing attention</CardTitle>
              <CardDescription>
                Advance status or run allocation
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                render={<Link href="/operator/allocation" />}
              >
                Allocation
              </Button>
              <Button
                size="sm"
                variant="outline"
                render={<Link href="/operator/events" />}
              >
                Events
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {needingStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active events on this page.
              </p>
            ) : (
              needingStatus.slice(0, 5).map((event) => (
                <Link
                  key={event.id}
                  href={`/operator/events/${event.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <span className="font-medium">
                    {formatEventDate(event.scheduledStart)}
                  </span>
                  <EventStatusBadge status={event.status} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
