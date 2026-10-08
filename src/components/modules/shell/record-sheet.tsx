"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function RecordSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  fullPageHref,
  fullPageLabel = "Open full page",
  size = "md",
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  fullPageHref?: string;
  fullPageLabel?: string;
  size?: "sm" | "md" | "lg";
  footer?: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size={size} className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 px-4 pb-4">{children}</div>
        <SheetFooter>
          {footer}
          {fullPageHref ? (
            <Button
              variant="outline"
              render={<Link href={fullPageHref} />}
              onClick={() => onOpenChange(false)}
            >
              {fullPageLabel}
            </Button>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
