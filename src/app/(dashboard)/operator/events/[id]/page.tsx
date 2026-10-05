import { EventDetail } from "@/components/modules/events";

export default async function OperatorEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <EventDetail eventId={id} basePath="/operator/events" canManage />
  );
}
