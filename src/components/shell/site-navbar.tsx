"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

const links = [
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Register" },
] as const;

export function SiteNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          PowerMesh
        </Link>
        <div className="flex items-center gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Button
                key={link.href}
                asChild
                size="sm"
                variant={link.href === "/register" ? "default" : "ghost"}
                className={cn(active && link.href !== "/register" && "bg-muted")}
              >
                <Link href={link.href} aria-current={active ? "page" : undefined}>
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
