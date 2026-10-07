import { EventDetail } from "@/components/modules/events";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default async function ConsumerEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDetail eventId={id} basePath="/consumer/events" />;
}
