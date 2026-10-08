"use client";

import { EventDetail } from "@/components/modules/events";
import {
  MissingStaticId,
  useStaticRouteId,
} from "@/components/shell/static-id-page";

export default function AdminEventDetailClient() {
  const id = useStaticRouteId();
  if (!id) return <MissingStaticId />;
  return (
    <EventDetail eventId={id} basePath="/admin/events" canManage={false} />
  );
}
