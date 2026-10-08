"use client";

import { UpdateOfferForm } from "@/components/modules/offers";
import {
  MissingStaticId,
  useStaticRouteId,
} from "@/components/shell/static-id-page";

export default function ProviderOfferDetailClient() {
  const id = useStaticRouteId();
  if (!id) return <MissingStaticId />;
  return <UpdateOfferForm offerId={id} basePath="/provider/offers" />;
}
