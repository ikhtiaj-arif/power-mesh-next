import { DashboardShell } from "@/components/shell/dashboard-shell";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="PROVIDER">{children}</DashboardShell>;
}
