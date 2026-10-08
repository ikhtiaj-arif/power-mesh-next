import { AdminUserDetail } from "@/components/modules/admin/admin-user-detail";
import { StaticIdPage } from "@/components/shell/static-id-page";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function AdminUserDetailPage() {
  return (
    <StaticIdPage>
      {(id) => <AdminUserDetail userId={id} />}
    </StaticIdPage>
  );
}
