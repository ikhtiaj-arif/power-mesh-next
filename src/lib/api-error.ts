import type { ApiErrorBody } from "@/types";

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;
    if (typeof data === "object" && data !== null && "message" in data) {
      const message = (data as ApiErrorBody).message;
      if (typeof message === "string" && message.length > 0) {
        return message;
      }
    }
  }

  if (error instanceof Error && error.message && !/failed to fetch|<no response>/i.test(error.message)) {
    return error.message;
  }

  return fallback;
}
