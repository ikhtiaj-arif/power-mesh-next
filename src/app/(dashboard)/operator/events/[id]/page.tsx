import Client from "./client";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function OperatorEventDetailPage() {
  return <Client />;
}
