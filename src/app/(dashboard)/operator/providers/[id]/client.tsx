"use client";

import { ProviderDetail } from "@/components/modules/approve-provider";
import {
  MissingStaticId,
  useStaticRouteId,
} from "@/components/shell/static-id-page";

export default function OperatorProviderDetailClient() {
  const id = useStaticRouteId();
  if (!id) return <MissingStaticId />;
  return <ProviderDetail providerId={id} basePath="/operator/providers" />;
}
