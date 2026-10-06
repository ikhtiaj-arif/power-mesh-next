import { Button } from "@/components/ui/button";
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
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          {subtitle ? (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <Button variant="outline" size="xs" disabled>
          Filter
        </Button>
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
            rows.map((row) => (
              <TableRow key={row.id}>
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
                <TableCell className="text-muted-foreground">{row.meta}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
