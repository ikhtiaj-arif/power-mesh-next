import { getProviderStaticParams } from "@/lib/isr/providers";

import Client from "./client";

export const revalidate = 120;

export async function generateStaticParams() {
  return getProviderStaticParams();
}

export default function AdminProviderDetailPage() {
  return <Client />;
}
