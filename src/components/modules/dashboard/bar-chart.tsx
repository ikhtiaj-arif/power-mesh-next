import { cn } from "@/lib/utils";

type BarChartProps = {
  title: string;
  subtitle?: string;
  series: Array<{ label: string; primary: number; secondary: number }>;
  primaryLabel: string;
  secondaryLabel: string;
  className?: string;
};

export function BarChart({
  title,
  subtitle,
  series,
  primaryLabel,
  secondaryLabel,
  className,
}: BarChartProps) {
  const max = Math.max(
    ...series.flatMap((item) => [item.primary, item.secondary]),
    1,
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card p-4 shadow-sm",
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium">{title}</h3>
        {subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex h-48 items-end gap-3">
        {series.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-40 w-full items-end justify-center gap-1">
              <div
                className="w-2.5 rounded-t bg-primary"
                style={{ height: `${(item.primary / max) * 100}%` }}
                title={`${primaryLabel}: ${item.primary}`}
              />
              <div
                className="w-2.5 rounded-t bg-primary/35"
                style={{ height: `${(item.secondary / max) * 100}%` }}
                title={`${secondaryLabel}: ${item.secondary}`}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-primary" />
          {primaryLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-primary/35" />
          {secondaryLabel}
        </span>
      </div>
    </div>
  );
}
