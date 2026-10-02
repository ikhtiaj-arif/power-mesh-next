import { SiteNavbar } from "@/components/shell/site-navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNavbar />
      {children}
    </>
  );
}
