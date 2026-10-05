"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-lg font-semibold">Dashboard failed to load</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "Something went wrong while rendering this screen."}
      </p>
      <button
        type="button"
        className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
