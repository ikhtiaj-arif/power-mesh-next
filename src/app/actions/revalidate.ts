"use server";

import { updateTag } from "next/cache";

import { AUDIT_CACHE_TAG, USERS_CACHE_TAG } from "@/lib/isr/admin";
import { EVENTS_CACHE_TAG } from "@/lib/isr/events";
import { PROVIDERS_CACHE_TAG } from "@/lib/isr/providers";
import {
  PAYMENTS_CACHE_TAG,
  REQUESTS_CACHE_TAG,
} from "@/lib/isr/requests-payments";

export async function revalidateProvidersCache() {
  updateTag(PROVIDERS_CACHE_TAG);
}

export async function revalidateEventsCache() {
  updateTag(EVENTS_CACHE_TAG);
}

export async function revalidateUsersCache() {
  updateTag(USERS_CACHE_TAG);
}

export async function revalidateAuditCache() {
  updateTag(AUDIT_CACHE_TAG);
}

export async function revalidateRequestsCache() {
  updateTag(REQUESTS_CACHE_TAG);
}

export async function revalidatePaymentsCache() {
  updateTag(PAYMENTS_CACHE_TAG);
}
