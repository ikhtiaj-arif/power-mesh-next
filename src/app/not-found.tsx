import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-medium tracking-wide text-muted-foreground">
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        That route is not part of PowerMesh. Head home or sign in to open your
        role workspace.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Home
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
