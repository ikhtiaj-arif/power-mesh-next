"use client";

import { RequestDetail } from "@/components/modules/requests";
import {
  MissingStaticId,
  useStaticRouteId,
} from "@/components/shell/static-id-page";

export default function ConsumerRequestDetailClient() {
  const id = useStaticRouteId();
  if (!id) return <MissingStaticId />;
  return <RequestDetail requestId={id} basePath="/consumer/requests" />;
}
