import Client from "./client";

export function generateStaticParams() {
  return [{ reservationId: "_" }];
}

export default function ProviderDeliveryDetailPage() {
  return <Client />;
}
