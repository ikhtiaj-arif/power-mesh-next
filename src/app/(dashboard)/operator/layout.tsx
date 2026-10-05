import { DashboardShell } from "@/components/shell/dashboard-shell";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="OPERATOR">{children}</DashboardShell>;
}
