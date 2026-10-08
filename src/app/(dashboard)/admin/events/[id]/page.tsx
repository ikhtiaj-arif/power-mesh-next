import { EventDetail } from "@/components/modules/events";
import { StaticIdPage } from "@/components/shell/static-id-page";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function AdminEventDetailPage() {
  return (
    <StaticIdPage>
      {(id) => (
        <EventDetail eventId={id} basePath="/admin/events" canManage={false} />
      )}
    </StaticIdPage>
  );
}
