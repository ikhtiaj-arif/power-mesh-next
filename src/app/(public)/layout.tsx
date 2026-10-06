import { Header } from "@/components/shell/Header";

/** Public marketing and auth chrome are fully static at build time. */
export const dynamic = "force-static";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
