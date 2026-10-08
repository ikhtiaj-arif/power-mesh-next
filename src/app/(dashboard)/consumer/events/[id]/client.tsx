"use client";

import { EventDetail } from "@/components/modules/events";
import {
  MissingStaticId,
  useStaticRouteId,
} from "@/components/shell/static-id-page";

export default function ConsumerEventDetailClient() {
  const id = useStaticRouteId();
  if (!id) return <MissingStaticId />;
  return <EventDetail eventId={id} basePath="/consumer/events" />;
}
