import { cn } from "@/lib/utils";

type LineChartProps = {
  title: string;
  subtitle?: string;
  current: number[];
  previous: number[];
  labels: string[];
  className?: string;
};

function toPoints(values: number[], width: number, height: number) {
  const max = Math.max(...values, 1);
  const step = width / Math.max(values.length - 1, 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / max) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
}

export function LineChart({
  title,
  subtitle,
  current,
  previous,
  labels,
  className,
}: LineChartProps) {
  const width = 480;
  const height = 180;

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
      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
          points={toPoints(previous, width, height)}
          className="text-primary"
        />
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          points={toPoints(current, width, height)}
          className="text-primary"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
