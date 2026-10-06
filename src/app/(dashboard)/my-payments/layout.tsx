import { DashboardShell } from "@/components/shell/dashboard-shell";

export default function MyPaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="CONSUMER">{children}</DashboardShell>;
}
