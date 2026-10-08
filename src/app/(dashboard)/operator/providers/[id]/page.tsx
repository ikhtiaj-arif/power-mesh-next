import { ProviderDetail } from "@/components/modules/approve-provider";
import { StaticIdPage } from "@/components/shell/static-id-page";
import { getProviderStaticParams } from "@/lib/isr/providers";

export const revalidate = 120;

export async function generateStaticParams() {
  return getProviderStaticParams();
}

export default function OperatorProviderDetailPage() {
  return (
    <StaticIdPage>
      {(id) => (
        <ProviderDetail providerId={id} basePath="/operator/providers" />
      )}
    </StaticIdPage>
  );
}
