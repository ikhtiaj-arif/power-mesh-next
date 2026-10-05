import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  description?: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
};

export function StatCard({
  title,
  value,
  description,
  trend,
  trendUp,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card p-4 shadow-sm",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {trend ? (
          <span
            className={cn(
              "text-xs font-medium",
              trendUp ? "text-emerald-700" : "text-destructive",
            )}
          >
            {trend}
          </span>
        ) : null}
      </div>
      {description ? (
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
