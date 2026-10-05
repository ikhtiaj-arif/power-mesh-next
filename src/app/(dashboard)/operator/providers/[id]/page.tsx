import { ProviderDetail } from "@/components/modules/approve-provider";

export default async function OperatorProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProviderDetail providerId={id} basePath="/operator/providers" />;
}
