import { RequestDetail } from "@/components/modules/requests";
import { StaticIdPage } from "@/components/shell/static-id-page";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function ConsumerRequestDetailPage() {
  return (
    <StaticIdPage>
      {(id) => (
        <RequestDetail requestId={id} basePath="/consumer/requests" />
      )}
    </StaticIdPage>
  );
}
