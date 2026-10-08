import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type OverviewRow = {
  id: string;
  primary: string;
  secondary: string;
  status: string;
  meta: string;
  href?: string;
};

type OverviewTableProps = {
  title: string;
  subtitle?: string;
  columns: [string, string, string, string];
  rows: OverviewRow[];
  className?: string;
  emptyMessage?: string;
  statusRenderer?: (status: string) => React.ReactNode;
};

export function OverviewTable({
  title,
  subtitle,
  columns,
  rows,
  className,
  emptyMessage = "No rows yet.",
  statusRenderer,
}: OverviewTableProps) {
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
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-sm text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const cells = (
                <>
                  <TableCell className="font-medium">{row.primary}</TableCell>
                  <TableCell>{row.secondary}</TableCell>
                  <TableCell>
                    {statusRenderer ? (
                      statusRenderer(row.status)
                    ) : (
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
                        {row.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.meta}
                  </TableCell>
                </>
              );

              if (row.href) {
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell colSpan={4} className="p-0">
                      <Link
                        href={row.href}
                        className="grid grid-cols-4 items-center gap-4 px-2 py-2"
                      >
                        <span className="font-medium">{row.primary}</span>
                        <span>{row.secondary}</span>
                        <span>
                          {statusRenderer ? (
                            statusRenderer(row.status)
                          ) : (
                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
                              {row.status}
                            </span>
                          )}
                        </span>
                        <span className="text-muted-foreground">{row.meta}</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              }

              return <TableRow key={row.id}>{cells}</TableRow>;
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
