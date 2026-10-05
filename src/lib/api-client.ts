import type {
  $Fetch,
  FetchOptions,
  FetchRequest,
  MappedResponseType,
  ResponseType,
} from "ofetch";
import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const REFRESH_PATH = "/auth/refresh-token";

/**
 * The raw transport. No auth logic lives here on purpose: the refresh call
 * below has to bypass the retry wrapper, or a genuinely expired session would
 * recurse.
 */
const httpClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

/**
 * Single-flight refresh.
 *
 * A dashboard mounts several react-query hooks at once, so a session that
 * expires between page loads can produce five simultaneous 401s. Without
 * deduplication that is five refresh calls racing, and the backend rotates the
 * refresh token on each one, so all but the last would present an already-
 * rotated token and fail. Callers share the in-flight promise instead.
 *
 * Set to null on settle so a later expiry can refresh again.
 */
let inFlightRefresh: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  inFlightRefresh ??= (async () => {
    try {
      await httpClient(REFRESH_PATH, { method: "POST" });
      return true;
    } catch {
      // 400 when the cookie is absent, 401/403 when it is invalid or expired.
      // Either way there is no session left to recover, and the caller's
      // original error is the more useful thing to surface.
      return false;
    } finally {
      inFlightRefresh = null;
    }
  })();

  return inFlightRefresh;
}

function isUnauthorized(error: unknown): boolean {
  const status = (error as { status?: number; statusCode?: number }) ?? {};
  return (status.status ?? status.statusCode) === 401;
}

/** Session probes and auth endpoints must not start a refresh loop. */
function shouldAttemptRefresh(request: unknown): boolean {
  if (typeof request !== "string") {
    return true;
  }

  return !(
    request.includes(REFRESH_PATH) ||
    request.includes("/auth/me") ||
    request.includes("/auth/logout") ||
    request.includes("/auth/login") ||
    request.includes("/auth/register") ||
    request.includes("/auth/google-login") ||
    request.includes("/auth/verify-email")
  );
}

async function request<T, R extends ResponseType = "json">(
  fetchRequest: FetchRequest,
  options?: FetchOptions<R>,
): Promise<MappedResponseType<R, T>> {
  try {
    return await httpClient<T, R>(fetchRequest, options);
  } catch (error) {
    if (!isUnauthorized(error) || !shouldAttemptRefresh(fetchRequest)) {
      throw error;
    }

    if (!(await refreshAccessToken())) {
      throw error;
    }

    return httpClient<T, R>(fetchRequest, options);
  }
}

const apiClient = request as $Fetch;

export default apiClient;
