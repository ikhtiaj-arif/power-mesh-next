import { HeroVisual } from "@/components/modules/marketing/hero-visual";

const defaultBullets = [
  "Request backup kilowatts for a scheduled outage window.",
  "Providers publish priced capacity after approval.",
  "Pay with bKash when your reservation is allocated.",
] as const;

export function AuthSidePanel({
  title = "Capacity when the grid is down",
  bullets = defaultBullets,
}: {
  title?: string;
  bullets?: readonly string[];
}) {
  return (
    <aside className="hidden flex-col justify-center gap-6 lg:flex">
      <div>
        <p className="text-2xl font-semibold tracking-tight text-balance">
          {title}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-pretty">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
      <HeroVisual />
    </aside>
  );
}
