import { EventDetail } from "@/components/modules/events";
import { StaticIdPage } from "@/components/shell/static-id-page";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function OperatorEventDetailPage() {
  return (
    <StaticIdPage>
      {(id) => (
        <EventDetail eventId={id} basePath="/operator/events" canManage />
      )}
    </StaticIdPage>
  );
}
