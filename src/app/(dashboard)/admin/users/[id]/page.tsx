import { AdminUserDetail } from "@/components/modules/admin/admin-user-detail";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminUserDetail userId={id} />;
}
