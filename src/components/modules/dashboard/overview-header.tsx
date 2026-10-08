import type { ReactNode } from "react";

type OverviewHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function OverviewHeader({
  title,
  description,
  actions,
}: OverviewHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
