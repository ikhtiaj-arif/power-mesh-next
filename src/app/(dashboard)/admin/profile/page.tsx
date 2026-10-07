import { Suspense } from "react";

import { ProfileView } from "@/components/modules/profile";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3 p-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      }
    >
      <ProfileView />
    </Suspense>
  );
}
