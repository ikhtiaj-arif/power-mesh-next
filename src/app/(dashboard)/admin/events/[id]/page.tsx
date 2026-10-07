import { EventDetail } from "@/components/modules/events";

// Static export requires at least one entry; real IDs are resolved client-side.
export function generateStaticParams() {
  return [{ id: "_" }];
}

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDetail eventId={id} basePath="/admin/events" />;
}
