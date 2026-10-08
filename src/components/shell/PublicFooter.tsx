import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-2">
          <p className="text-sm font-semibold tracking-tight">PowerMesh</p>
          <p className="text-sm text-muted-foreground text-pretty">
            Backup capacity for scheduled outage windows. Match demand with
            approved providers and settle with bKash.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:gap-12">
          <div className="space-y-2">
            <p className="font-medium">Product</p>
            <Link
              href="/#how-it-works"
              className="block text-muted-foreground hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="/#faq"
              className="block text-muted-foreground hover:text-foreground"
            >
              FAQ
            </Link>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Get started</p>
            <Link
              href="/register"
              className="block text-muted-foreground hover:text-foreground"
            >
              Create account
            </Link>
            <Link
              href="/register/provider"
              className="block text-muted-foreground hover:text-foreground"
            >
              Apply as provider
            </Link>
            <Link
              href="/login"
              className="block text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
