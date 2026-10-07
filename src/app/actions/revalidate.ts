// Server actions that called updateTag/revalidateTag are no-ops in static
// export: there is no ISR runtime on a static host. The functions are kept so
// call-sites compile without changes; they simply do nothing at runtime.

export async function revalidateProvidersCache() {}
export async function revalidateEventsCache() {}
export async function revalidateUsersCache() {}
export async function revalidateAuditCache() {}
export async function revalidateRequestsCache() {}
export async function revalidatePaymentsCache() {}
