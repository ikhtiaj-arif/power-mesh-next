import type { ApiErrorBody } from "@/types";

function messageFromBody(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const body = data as ApiErrorBody & {
    errorMessages?: Array<string | { message?: string }>;
    errors?: Array<string | { message?: string }>;
  };

  if (typeof body.message === "string" && body.message.length > 0) {
    return body.message;
  }

  const details = body.errorMessages ?? body.errors;
  if (Array.isArray(details) && details.length > 0) {
    const first = details[0];
    if (typeof first === "string" && first.length > 0) {
      return first;
    }
    if (
      typeof first === "object" &&
      first !== null &&
      typeof first.message === "string" &&
      first.message.length > 0
    ) {
      return first.message;
    }
  }

  return null;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const fromData = messageFromBody(error.data);
    if (fromData) {
      return fromData;
    }
  }

  if (error instanceof Error && error.message) {
    if (!/failed to fetch|<no response>/i.test(error.message)) {
      return error.message;
    }
  }

  return fallback;
}
