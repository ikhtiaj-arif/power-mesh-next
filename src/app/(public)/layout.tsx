import { Header } from "@/components/shell/Header";
import { PublicFooter } from "@/components/shell/PublicFooter";

/** Public marketing and auth chrome are fully static at build time. */
export const dynamic = "force-static";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      {children}
      <PublicFooter />
    </div>
  );
}
