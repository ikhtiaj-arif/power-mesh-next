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

function isRefreshRequest(request: unknown): boolean {
  return typeof request === "string" && request.includes(REFRESH_PATH);
}

/**
 * The app's only HTTP client.
 *
 * On a 401 it refreshes the access token once and replays the request, so an
 * access-token expiry is invisible instead of dumping the user on the login
 * page. Only one retry is ever attempted: the replay goes through
 * `httpClient`, which has no retry logic, so a second 401 propagates as an
 * ordinary error rather than looping.
 *
 * DELIBERATELY DOES NOT REDIRECT ON FAILURE. A 401 is only a reason to leave
 * the page when a protected page cannot render, and that layer knows the
 * current route: AuthGuard sends the user to /login and preserves where they
 * were. Redirecting from here would also fire on public pages (a stray 401 from
 * a marketing endpoint would throw someone out of the site) and would race the
 * guard's own redirect.
 *
 * `as $Fetch` is what keeps `apiClient<T>(url, options)` identical at every
 * call site, generics and per-call overrides included; the implementation below
 * is written against that same signature rather than through `any`.
 *
 * Only the callable form is implemented, which is all the codebase uses. The
 * cast means `apiClient.raw`, `.native` and `.create` would still typecheck and
 * then fail at runtime, so reach for `httpClient` if a future caller needs one.
 */
async function request<T, R extends ResponseType = "json">(
  fetchRequest: FetchRequest,
  options?: FetchOptions<R>,
): Promise<MappedResponseType<R, T>> {
  try {
    return await httpClient<T, R>(fetchRequest, options);
  } catch (error) {
    if (!isUnauthorized(error) || isRefreshRequest(fetchRequest)) {
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
