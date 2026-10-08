import Client from "./client";

export function generateStaticParams() {
  return [{ reservationId: "_" }];
}

export default function ConsumerDeliveryDetailPage() {
  return <Client />;
}
