import { RequestDetail } from "@/components/modules/requests";

export default async function ConsumerRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RequestDetail requestId={id} basePath="/consumer/requests" />;
}
