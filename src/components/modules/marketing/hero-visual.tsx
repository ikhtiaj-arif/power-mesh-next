export function HeroVisual({ className }: { className?: string }) {
  return (
    <div
      className={
        className ??
        "relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-muted/80 via-background to-muted p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
      }
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <svg
          viewBox="0 0 480 360"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="meshA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.58 0.031 107.3)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="oklch(0.228 0.013 107.4)" stopOpacity="0.08" />
            </linearGradient>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="oklch(0.58 0.031 107.3)"
                strokeOpacity="0.18"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="480" height="360" fill="url(#grid)" />
          <path
            d="M40 280 C120 220, 180 300, 260 240 C320 200, 360 160, 440 120"
            stroke="url(#meshA)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M60 120 C140 160, 200 80, 280 140 C340 180, 380 220, 440 200"
            stroke="oklch(0.466 0.025 107.3)"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="120" cy="240" r="6" fill="oklch(0.228 0.013 107.4)" />
          <circle cx="260" cy="240" r="6" fill="oklch(0.228 0.013 107.4)" />
          <circle cx="380" cy="150" r="6" fill="oklch(0.228 0.013 107.4)" />
        </svg>
      </div>

      <div className="relative space-y-4">
        <div className="rounded-xl border border-border/80 bg-background/95 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Outage window
              </p>
              <p className="mt-1 text-base font-semibold tracking-tight">
                Tonight · 10:00 PM – 2:00 AM
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                180 kW remaining of 320 kW
              </p>
            </div>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              Scheduled
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[56%] rounded-full bg-primary" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/80 bg-background/95 p-3 shadow-sm backdrop-blur-sm">
            <p className="text-xs text-muted-foreground">Your request</p>
            <p className="mt-1 text-sm font-semibold">40 kW · Pending</p>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/95 p-3 shadow-sm backdrop-blur-sm">
            <p className="text-xs text-muted-foreground">Pay with</p>
            <p className="mt-1 text-sm font-semibold">bKash · BDT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
