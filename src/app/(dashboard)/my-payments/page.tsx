import { Suspense } from "react";

import { MyPaymentsReturn } from "@/components/modules/payments";

export default function MyPaymentsPage() {
  return (
    <Suspense fallback={null}>
      <MyPaymentsReturn />
    </Suspense>
  );
}
