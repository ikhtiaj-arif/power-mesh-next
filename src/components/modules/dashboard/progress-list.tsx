import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ProgressItem = {
  label: string;
  value: number;
  hint?: string;
};

type ProgressListProps = {
  title: string;
  subtitle?: string;
  items: ProgressItem[];
  className?: string;
};

export function ProgressList({
  title,
  subtitle,
  items,
  className,
}: ProgressListProps) {
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
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span>{item.label}</span>
              <span className="text-muted-foreground">
                {item.hint ?? `${item.value}%`}
              </span>
            </div>
            <Progress value={item.value} />
          </li>
        ))}
      </ul>
    </div>
  );
}
