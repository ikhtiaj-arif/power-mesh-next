import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

type OverviewHeaderProps = {
  title: string;
  description: string;
  rangeLabel?: string;
};

export function OverviewHeader({
  title,
  description,
  rangeLabel = "Last 30 days",
}: OverviewHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-2">
        <SidebarTrigger className="mt-0.5" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          {rangeLabel}
        </Button>
        <Button variant="outline" size="sm" disabled>
          Export
        </Button>
        <Button size="sm" disabled>
          Refresh
        </Button>
      </div>
    </div>
  );
}
