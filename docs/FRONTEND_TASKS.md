# Frontend tasks

Status values: `TODO`, `IN_PROGRESS`, `BLOCKED`, `REVIEW`, `DONE`.

All buildable work starts as `TODO`. Nothing here is `DONE`. The frontend app does not exist yet. Tasks under **Blocked backend work** are `BLOCKED` because the live API cannot support them. Do not implement those tasks by faking data.

Update this file when a task moves. One task per implementation pass unless the user asks for a batch.

Phases: 0 Foundation, 1 Authentication, 2 Account, 3 Consumer, 4 Provider, 5 Operator, 6 Payments, 7 Delivery, 8 Admin, 9 Hardening, 10 Deployment. That is 11 phases, plus the blocked list.

First task to execute: **P0-01**.

## Index

| ID | Phase | Status | Title |
| --- | --- | --- | --- |
| P0-01 | 0 | DONE | Scaffold the Next.js app |
| P0-02 | 0 | TODO | Shared UI primitives |
| P0-03 | 0 | TODO | Environment split |
| P0-04 | 0 | TODO | API envelope client |
| P0-05 | 0 | TODO | BFF session routes |
| P0-06 | 0 | TODO | BFF proxy |
| P0-07 | 0 | TODO | Query client, keys, enums |
| P0-08 | 0 | TODO | Root shell files |
| P0-09 | 0 | TODO | Shared Zod mirrors |
| P1-01 | 1 | TODO | Middleware navigation guards |
| P1-02 | 1 | TODO | Marketing home |
| P1-03 | 1 | TODO | Login |
| P1-04 | 1 | TODO | Demo login |
| P1-05 | 1 | TODO | Consumer registration |
| P1-06 | 1 | TODO | Consumer OTP verify |
| P1-07 | 1 | TODO | Provider application |
| P1-08 | 1 | TODO | Provider OTP verify |
| P1-09 | 1 | TODO | Google consumer login |
| P1-10 | 1 | TODO | Logout |
| P1-11 | 1 | TODO | Session profile from users/me |
| P1-12 | 1 | TODO | Role shells and navigation |
| P2-01 | 2 | TODO | View profile |
| P2-02 | 2 | TODO | Edit profile |
| P2-03 | 2 | TODO | Profile photo upload |
| P3-01 | 3 | DONE | Available events |
| P3-02 | 3 | TODO | Event detail and offers |
| P3-03 | 3 | DONE | Create capacity request |
| P3-04 | 3 | DONE | Update or cancel a request |
| P3-05 | 3 | DONE | My requests |
| P3-06 | 3 | TODO | Create reservation |
| P3-07 | 3 | TODO | My reservations and cancel |
| P3-08 | 3 | TODO | Consumer home |
| P4-01 | 4 | TODO | Provider approval gate |
| P4-02 | 4 | TODO | My offers |
| P4-03 | 4 | TODO | Create offer |
| P4-04 | 4 | TODO | Update or soft-delete an offer |
| P4-05 | 4 | TODO | Provider reservations |
| P5-01 | 5 | DONE | Operator events list |
| P5-02 | 5 | DONE | Create event |
| P5-03 | 5 | DONE | Update event |
| P5-04 | 5 | DONE | Event status transitions |
| P5-05 | 5 | DONE | Soft-delete event |
| P5-06 | 5 | DONE | Provider queue |
| P5-07 | 5 | DONE | Approve or reject a provider |
| P5-08 | 5 | TODO | Allocation preview and approve |
| P5-09 | 5 | TODO | Reservation status override |
| P5-10 | 5 | TODO | Operator payment list |
| P5-11 | 5 | TODO | Operator request list |
| P6-01 | 6 | TODO | Initiate bKash payment |
| P6-02 | 6 | TODO | Redirect to bkashURL |
| P6-03 | 6 | TODO | Payment return page |
| P6-04 | 6 | TODO | Consumer payment history |
| P7-01 | 7 | TODO | Provider check-in |
| P7-02 | 7 | TODO | Provider delivered-kW report |
| P7-03 | 7 | TODO | Consumer confirm delivery |
| P7-04 | 7 | TODO | Consumer dispute |
| P7-05 | 7 | TODO | Delivery detail |
| P8-01 | 8 | TODO | Admin dashboard stats |
| P8-02 | 8 | TODO | Admin user list |
| P8-03 | 8 | TODO | Admin user detail |
| P8-04 | 8 | TODO | Block or unblock a user |
| P8-05 | 8 | TODO | Soft-delete a user |
| P8-06 | 8 | TODO | Audit log |
| P8-07 | 8 | TODO | Admin allocation without event writes |
| P8-08 | 8 | DONE | Admin provider approval entry |
| P9-01 | 9 | TODO | Mobile navigation and accessibility |
| P9-02 | 9 | TODO | Empty, error, and loading states |
| P9-03 | 9 | TODO | Cross-role browser pass |
| P9-04 | 9 | TODO | API error mapping |
| P9-05 | 9 | TODO | Token exposure review |
| P10-01 | 10 | TODO | Production build and env checklist |
| P10-02 | 10 | TODO | Deploy the frontend |
| P10-03 | 10 | TODO | Production cookie and CORS check |
| BX-01 | — | BLOCKED | Password reset and change |
| BX-02 | — | BLOCKED | OTP resend |
| BX-03 | — | BLOCKED | Ratings |
| BX-04 | — | BLOCKED | Incident management |
| BX-05 | — | BLOCKED | Zones and standing offers |
| BX-06 | — | BLOCKED | SSLCommerz or Stripe |
| BX-07 | — | BLOCKED | Seeded provider can create an offer immediately |
| BX-08 | — | BLOCKED | Paged provider list |
| BX-09 | — | BLOCKED | bKash partial-delivery refund |
| BX-10 | — | BLOCKED | Refresh-token revocation |

Buildable tasks: 73. P0-01 is `DONE`. The rest are `TODO`. Blocked tasks: 10.

---

## Phase 0 — Foundation

### P0-01 Scaffold the Next.js app

- **Phase:** 0
- **Priority:** High
- **Status:** DONE
- **Dependencies:** none
- **Backend dependency:** none
- **Description:** Scaffold the TypeScript Next.js App Router app with Tailwind CSS at the root of this repository, using the `src/` directories in `FRONTEND_PLAN.md`. Do not create a nested `frontend/` package. Do not add feature pages beyond a placeholder root under `src/app/(public)` that the later marketing task replaces. Empty directories for `src/api`, `src/assets`, `src/components`, `src/hooks`, `src/lib`, `src/providers`, `src/routes`, `src/types`, `src/utils`, and `src/validation` may be created with this task only if the scaffold needs them to exist. Do not put page components in `src/routes`.
- **Acceptance criteria:**
  - The app installs from this repository and `next build` succeeds.
  - `src/app` exists. Page files are not under `src/routes`.
  - TypeScript strictness is on.
  - No secrets and no copy of `../power-mesh-server/.env`.

### P0-02 Shared UI primitives

- **Phase:** 0
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-01
- **Backend dependency:** none
- **Description:** Add shadcn/ui primitives used by later tasks (button, input, label, form, dialog, table, badge, sonner or equivalent toast), `next/font`, and the empty/error/skeleton presentational components.
- **Acceptance criteria:**
  - Primitives are keyboard-focusable and labeled where they take input.
  - Toast renders API `message` as text.
  - Mobile layout does not overflow a 360px viewport on the primitive gallery or root layout.

### P0-03 Environment split

- **Phase:** 0
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-01
- **Backend dependency:** API base URL only
- **Description:** Add server-only `API_URL` and public `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_DEMO_LOGIN`. Document placeholders in `.env.example` at this repository root.
- **Acceptance criteria:**
  - `API_URL` is not referenced from a client component.
  - Example values are placeholders, not live secrets.
  - Demo login flag defaults off unless the example explicitly sets it for local dev.

### P0-04 API envelope client

- **Phase:** 0
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-03
- **Backend dependency:** `sendResponse` and `globalErrorHandler` shapes
- **Description:** Add `src/api` with typed success `{ success, statusCode, message, data, meta }` and error `{ success, message, errors }`. Server fetch attaches the bearer token from the first-party cookie and does not import React. Thin `src/app/api/**/route.ts` files call these modules.
- **Acceptance criteria:**
  - 400, 401, 403, 404, 409, 429, and 502 surface `message` and `errors` without throwing away the status.
  - Health-check shape is not forced into the envelope.
  - The client never logs tokens or OTP values.

### P0-05 BFF session routes

- **Phase:** 0
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-04
- **Backend dependency:** `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh-token`, `POST /api/v1/auth/logout`. API cookies are `SameSite=None; Secure=false` and are not relied on.
- **Description:** Add `app/api/auth/login`, `refresh`, and `logout`. Login and refresh read tokens from the Express JSON, set first-party `httpOnly` cookies (`sameSite: lax`, `secure` in production, `path: /`), and return a body with no tokens. Logout clears those cookies with the same options and calls the API logout.
- **Acceptance criteria:**
  - Browser-visible JSON from these routes contains no `accessToken` or `refreshToken`.
  - Cookies are `httpOnly`.
  - A mismatched `Origin` on login and refresh is rejected.

### P0-06 BFF proxy

- **Phase:** 0
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-04, P0-05
- **Backend dependency:** all `/api/v1` routes the UI will call
- **Description:** Add `app/api/proxy/[...path]` that forwards method, query, JSON body, and bearer token to `API_URL`, and returns the upstream status and body.
- **Acceptance criteria:**
  - Query strings pass through unchanged.
  - Upstream 4xx and 5xx bodies pass through unchanged.
  - The proxy does not attach a token to public auth register calls that must stay anonymous. Document which prefixes stay unauthenticated.
  - Multipart profile upload is either forwarded here or given an explicit follow-up note inside P2-03 if this proxy is JSON-only.

### P0-07 Query client, keys, and enums

- **Phase:** 0
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-01
- **Backend dependency:** Prisma enums in `../power-mesh-server/prisma/schema/enums.prisma`
- **Description:** Add the TanStack Query provider in `src/providers`, a `ListQuery` type, query-key helpers, and enums in `src/types` copied from the live enums. Do not add a Zustand store. Sidebar state stays local to the shell client component.
- **Acceptance criteria:**
  - Default `refetchOnWindowFocus` is false.
  - Enums include the four roles, reservation statuses, offer statuses, event statuses, provider statuses, priority tiers, and resource types.
  - No server list is stored outside TanStack Query.

### P0-08 Root shell files

- **Phase:** 0
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P0-02, P0-07
- **Backend dependency:** none
- **Description:** Root `layout.tsx` mounts font, query provider, and toaster, with no role logic. Add root `not-found.tsx`.
- **Acceptance criteria:**
  - Root layout does not read the role or redirect.
  - Unknown URLs render the not-found page.

### P0-09 Shared Zod mirrors

- **Phase:** 0
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-01
- **Backend dependency:** `../power-mesh-server/src/modules/**/**.validation.ts` bodies that are actually mounted
- **Description:** Add Zod schemas under `src/validation` for login, consumer register, consumer verify, provider apply, provider verify, and the password rules. Comments must point at the backend file they mirror.
- **Acceptance criteria:**
  - Consumer `firstName` and `lastName` are 3–10 characters.
  - Provider names are 3–50 characters.
  - Password requires 8 characters, lower, upper, digit, and a symbol.
  - OTP is a string of length 6.
  - Schemas do not add a client-selectable role field.

---

## Phase 1 — Authentication

### P1-01 Middleware navigation guards

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-05
- **Backend dependency:** JWT payload includes `role` and expiry. Middleware is not authorization.
- **Description:** `middleware.ts` protects `/consumer`, `/provider`, `/operator`, `/admin`, and `/my-payments`. Missing or expired cookies go to `/login`. A signed-in user hitting `/login` goes to that role's home. Wrong-role prefixes redirect to the signed-in home.
- **Acceptance criteria:**
  - Unauthenticated requests to the five prefixes redirect to `/login`.
  - An admin cookie does not stay on `/operator` write routes via the layout; they are sent to `/admin`.
  - Marketing and auth form paths stay reachable while logged out.
  - Middleware does not grant access the API would forbid.

### P1-02 Marketing home

- **Phase:** 1
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P0-02, P0-08
- **Backend dependency:** none
- **Description:** Public page that explains the marketplace using the real flow: event, offer, request, allocation, bKash, delivery. Link to login, consumer register, and provider apply.
- **Acceptance criteria:**
  - The page does not fetch private API data.
  - It does not claim ratings, wallets, zones, or SSLCommerz.
  - It names four roles and does not say admin can create events.

### P1-03 Login

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-05, P0-09, P1-01
- **Backend dependency:** `POST /api/v1/auth/login`
- **Description:** Login form posts to the BFF. Errors show the API message. Success navigates to the role home.
- **Acceptance criteria:**
  - Failed password shows the API error and stays on the form.
  - Success does not write tokens to `localStorage` or `sessionStorage`.
  - The network response body visible to the page has no JWT.

### P1-04 Demo login

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P1-03
- **Backend dependency:** development seeds from `SEED_*` (admin, operator, provider, consumer). Provider offer create stays blocked by BX-07 even after this login works.
- **Description:** Four buttons, rendered only when `NEXT_PUBLIC_DEMO_LOGIN=true`, submit the documented development accounts through the same login route.
- **Acceptance criteria:**
  - Buttons are absent when the flag is not true.
  - Each button lands on that role's home.
  - Credentials are the seeded ones documented in the server README, labeled as development-only in the UI.
  - The provider button does not claim the account is approved.

### P1-05 Consumer registration

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-06, P0-09
- **Backend dependency:** `POST /api/v1/auth/register`. User row is not created yet.
- **Description:** Form for name, email, password, and optional consumer profile fields. On `emailSent` or a returned OTP, go to verify and keep the email. If `data.otp` is present, show it once on the verify step without logging it.
- **Acceptance criteria:**
  - Client validation matches the 3–10 name limit and password rules before submit.
  - Duplicate email shows the API error.
  - The form does not ask for a role.

### P1-06 Consumer OTP verify

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P1-05, P0-05
- **Backend dependency:** `POST /api/v1/auth/verify-email` creates the consumer and returns tokens.
- **Description:** Six-digit OTP form. The BFF must establish the session from this response the same way as login, still without exposing tokens to the page, then open the consumer home.
- **Acceptance criteria:**
  - Wrong OTP shows the API error.
  - Success lands on `/consumer` with a session cookie.
  - There is no resend button that calls a route that does not exist (see BX-02).

### P1-07 Provider application

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-09, P0-06
- **Backend dependency:** `POST /api/v1/provider/apply-as-provider`
- **Description:** Form for names (3–50), email, password, company, license, resource type, capacity, address, and contacts.
- **Acceptance criteria:**
  - Resource type options match the enum.
  - `capacityKw` must be a positive integer.
  - Submit moves to provider verify without creating UI that says the provider is already approved.

### P1-08 Provider OTP verify

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P1-07, P0-05
- **Backend dependency:** `POST /api/v1/provider/verify-email` creates `PENDING_APPROVAL` and issues tokens.
- **Description:** Verify provider email and start a provider session.
- **Acceptance criteria:**
  - Success lands on `/provider`.
  - The next screen can show pending approval (P4-01), not an offer form as if create would succeed.

### P1-09 Google consumer login

- **Phase:** 1
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P0-03, P0-05
- **Backend dependency:** `POST /api/v1/auth/google-login` with `{ idToken }`. Consumer role only.
- **Description:** Google Identity button requests an ID token and posts it through the BFF. The client secret never appears in the frontend.
- **Acceptance criteria:**
  - A new Google user becomes a consumer session.
  - An email that already belongs to another role shows the 403 message.
  - The button is omitted when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is empty, with a short explanation, not a broken widget.

### P1-10 Logout

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-05, P1-12
- **Backend dependency:** `POST /api/v1/auth/logout` does not revoke refresh tokens (BX-10).
- **Description:** Shell logout calls the BFF, clears the first-party cookies, clears the `me` query, and returns to `/login`.
- **Acceptance criteria:**
  - After logout, middleware blocks the role prefixes.
  - The UI does not claim other sessions or stolen tokens were revoked.

### P1-11 Session profile from users/me

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-06, P0-07
- **Backend dependency:** `GET /api/v1/users/me`. Do not use `GET /api/v1/auth/me` for the shell.
- **Description:** `['me']` query returns the user plus consumer, provider, and operator profiles. `staleTime` 5 minutes.
- **Acceptance criteria:**
  - Provider status and consumer profile are available from this query.
  - A 401 clears the local session flow and sends the user to login.
  - No second profile cache outside TanStack Query.

### P1-12 Role shells and navigation

- **Phase:** 1
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P1-01, P1-11, P0-02
- **Backend dependency:** role matrix in `FRONTEND_PLAN.md`
- **Description:** Dashboard layout reads the session on the server, renders a mobile-first sidebar, and links only to routes that role can call. Add `loading.tsx` and `error.tsx` for the dashboard segment. Placeholder homes are enough until later phases fill them.
- **Acceptance criteria:**
  - Consumer nav has no event-create or user-admin links.
  - Operator nav has event management and no user-admin links.
  - Admin nav has users, audit, and stats, and no event create.
  - Sidebar collapsed state is local state in the shell client component, and the menu works on a narrow screen.

---

## Phase 2 — Account

### P2-01 View profile

- **Phase:** 2
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P1-11, P1-12
- **Backend dependency:** `GET /api/v1/users/me`
- **Description:** Profile page for every role showing identity, role, and the matching profile block.
- **Acceptance criteria:**
  - Provider sees company, resource, capacity, and status.
  - Consumer sees organization and critical load when present.
  - Empty optional fields render an empty state, not fake defaults presented as saved data.

### P2-02 Edit profile

- **Phase:** 2
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P2-01
- **Backend dependency:** `PATCH /api/v1/users/me` (name limits on this schema differ from registration)
- **Description:** Edit the fields that `UpdateMe` accepts, including nested consumer or provider strings when that profile exists.
- **Acceptance criteria:**
  - Submit sends only changed allowed fields.
  - Success updates `['me']`.
  - The form does not offer role changes, email changes, or password changes (BX-01).

### P2-03 Profile photo upload

- **Phase:** 2
- **Priority:** Low
- **Status:** TODO
- **Dependencies:** P2-01, P0-06
- **Backend dependency:** `PATCH /api/v1/users/me/profile-picture`, multipart field `profilePicture` (JPEG, PNG, WEBP, AVIF)
- **Description:** File input uploads through a BFF path that forwards multipart. Show the Cloudinary URL with `next/image` after configuring remote patterns.
- **Acceptance criteria:**
  - Rejected file types show the API or a pre-check message.
  - The image renders after a successful upload.
  - If the JSON proxy cannot carry multipart, this task adds the dedicated route rather than base64-in-JSON.

---

## Phase 3 — Consumer

### P3-01 Available events

- **Phase:** 3
- **Priority:** High
- **Status:** DONE
- **Dependencies:** P1-12, P0-06, P0-07
- **Backend dependency:** `GET /api/v1/event/available` (any role; `SCHEDULED` or `CONFIRMED`; `scheduledEnd` in the future)
- **Description:** Paginated event list using URL search params. Default sort matches the API (`scheduledStart` asc) unless the user changes it.
- **Acceptance criteria:**
  - Empty API data renders an empty state.
  - Pagination uses `meta`.
  - The page is not reachable anonymously (middleware plus API 401).

### P3-02 Event detail and offers

- **Phase:** 3
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P3-01
- **Backend dependency:** `GET /api/v1/event/:id`, `GET /api/v1/offer/event/:eventId` (consumer is allowed; provider is not)
- **Description:** Event detail and the offers on that event. The static page renders the headings. A client island loads both reads together, not in a waterfall of effects.
- **Acceptance criteria:**
  - Offer price, remaining capacity, and delivery window are visible.
  - No offers renders an empty state.
  - Consumers do not call `GET /offer/:id` (that route excludes `CONSUMER`).

### P3-03 Create capacity request

- **Phase:** 3
- **Priority:** High
- **Status:** DONE
- **Dependencies:** P3-02
- **Backend dependency:** `POST /api/v1/request/create`. Event must be `SCHEDULED` or `CONFIRMED`. One row per consumer and event.
- **Description:** Form for `requestedKw`, `maxPricePerKwh`, and `priorityTier`.
- **Acceptance criteria:**
  - Priority options match the five tiers.
  - Success invalidates the event's request query and my-requests.
  - A 409 explains that this event already has a request, including after cancel.

### P3-04 Update or cancel a request

- **Phase:** 3
- **Priority:** High
- **Status:** DONE
- **Dependencies:** P3-03, P3-05
- **Backend dependency:** update and cancel only while `PENDING`. Cancel sets `CANCELLED` and does not free the unique pair.
- **Description:** Edit and cancel controls on the caller's pending request.
- **Acceptance criteria:**
  - Controls are hidden or disabled when status is not `PENDING`.
  - After cancel, create stays unavailable and the banner explains why.
  - The UI does not offer a second request for the same event.

### P3-05 My requests

- **Phase:** 3
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** P1-12, P0-07
- **Backend dependency:** `GET /api/v1/request/my-requests`
- **Description:** List the consumer's requests with status and priority filters in the URL.
- **Acceptance criteria:**
  - Filters map to query params the service reads.
  - Status badge text is present, not color alone.

### P3-06 Create reservation

- **Phase:** 3
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P3-02, P3-03
- **Backend dependency:** `POST /api/v1/reservation/create` with `{ offerId, requestId }`. This path does not update `OutageEvent.allocatedKw` and does not check price. Operator allocation is a different path (P5-08).
- **Description:** From an offer and the caller's pending request, create a reservation.
- **Acceptance criteria:**
  - The control is available only when the user has a usable request id and an offer id.
  - Success shows status `ALLOCATED` and links to payment once P6 exists, or a disabled pay slot until then.
  - API errors (capacity, uniqueness) show the server message.

### P3-07 My reservations and cancel

- **Phase:** 3
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P3-06
- **Backend dependency:** `GET /api/v1/reservation/my-reservations`, `PATCH /api/v1/reservation/cancel/:id` only from `ALLOCATED` or `PAYMENT_PENDING`
- **Description:** Reservation list and detail from the owned list. Cancel when the status allows it. Do not rely on `GET /reservation/:id` for authorization; that route does not check ownership.
- **Acceptance criteria:**
  - Cancel is unavailable outside `ALLOCATED` and `PAYMENT_PENDING`.
  - Cancel success refreshes the list and the related offer capacity view.
  - Another role's reservation id typed into the consumer URL does not display foreign data from the unscoped detail route.

### P3-08 Consumer home

- **Phase:** 3
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P3-01, P3-05, P3-07
- **Backend dependency:** the consumer list endpoints above, not admin stats
- **Description:** Consumer landing with counts or latest rows from the consumer's own lists, plus links into events, requests, and reservations.
- **Acceptance criteria:**
  - It does not call `/api/v1/admin/dashboard-stats`.
  - Empty accounts see guidance to browse events, not zeros presented as a loaded marketplace failure.

---

## Phase 4 — Provider

### P4-01 Provider approval gate

- **Phase:** 4
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P1-11, P1-12
- **Backend dependency:** `createOffer` requires `Provider.status === APPROVED`. Seeded demo user is not approved (BX-07).
- **Description:** Provider home reads status from `['me']`. `PENDING_EMAIL_VERIFICATION`, `PENDING_APPROVAL`, and `REJECTED` each get honest copy. Offer create links render only when `APPROVED`.
- **Acceptance criteria:**
  - The seeded provider sees a pending or unverified state after demo login, not a successful offer form.
  - `REJECTED` shows `rejectionReason` when the profile includes it.
  - The page does not call approve on itself.

### P4-02 My offers

- **Phase:** 4
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P4-01
- **Backend dependency:** `GET /api/v1/offer/my-offers`
- **Description:** Paginated offers for the signed-in provider.
- **Acceptance criteria:**
  - Status filter uses the offer status enum.
  - Empty and loading states exist.
  - The provider does not call `GET /offer/event/:eventId` (role excluded).

### P4-03 Create offer

- **Phase:** 4
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P4-01, P4-02
- **Backend dependency:** `POST /api/v1/offer/create`. Event id required. Capacity cannot exceed provider `capacityKw`. Delivery end after start. Approved providers only. Providers may load events via `GET /event/available` and `GET /event/:id`.
- **Description:** Offer form bound to an available event. Submit stays disabled with an explanation when status is not `APPROVED`.
- **Acceptance criteria:**
  - Unapproved submit never fires.
  - Approved submit creates an `AVAILABLE` offer and refreshes my-offers.
  - Validation errors from the API are visible.
  - There is no standing-offer mode (BX-05).

### P4-04 Update or soft-delete an offer

- **Phase:** 4
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P4-02
- **Backend dependency:** update only from `AVAILABLE` or `PARTIALLY_AVAILABLE`. Soft-delete sets `CANCELLED` and fails when blocking reservations exist.
- **Description:** Edit price, capacity, and window when the API allows. Soft-delete with a confirm dialog.
- **Acceptance criteria:**
  - Disallowed statuses hide edit.
  - Soft-delete failure shows the server message about active reservations.
  - The form does not expose every offer status as if transitions were free, even though the Zod body allows any status.

### P4-05 Provider reservations

- **Phase:** 4
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P1-11, P4-01
- **Backend dependency:** `GET /api/v1/reservation/provider/:providerId` using the provider id from `users/me`
- **Description:** List reservations for this provider so delivery actions have a target.
- **Acceptance criteria:**
  - The path id is the caller's provider id, not a typed id from an admin screen.
  - Rows show reservation status and allocated kW.
  - The provider payment-by-id route is not used to list foreign payments.

---

## Phase 5 — Operator

### P5-01 Operator events list

- **Phase:** 5
- **Priority:** High
- **Status:** DONE
- **Dependencies:** P1-12
- **Backend dependency:** `GET /api/v1/event/my-events` (owner). `GET /event/all` is available but my-events is the operator's own book.
- **Description:** List the operator's events with status filters.
- **Acceptance criteria:**
  - Only operator navigation shows this as a management list.
  - An admin opening the operator create URL is redirected by middleware (P1-01) or receives 403 if they hit the API.

### P5-02 Create event

- **Phase:** 5
- **Priority:** High
- **Status:** DONE
- **Dependencies:** P5-01
- **Backend dependency:** `POST /api/v1/event/create`. End after start. `survivalQuotaKw <= totalCapacityKw`. Initial status `SCHEDULED`. Quota is stored and not used by allocation; the form may still collect it because the API requires it.
- **Description:** Create form. Helper text states that survival quota is recorded and not applied by the allocator.
- **Acceptance criteria:**
  - Invalid date order is stopped to match the API rule.
  - Success status is `SCHEDULED`.
  - Admin role cannot submit this form from the admin shell.

### P5-03 Update event

- **Phase:** 5
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** P5-02
- **Backend dependency:** update only while `SCHEDULED` and only for the owning operator
- **Description:** Edit schedule, capacity, quota, and notes on the operator's scheduled event.
- **Acceptance criteria:**
  - Non-scheduled events do not show the editor.
  - Another operator's event id fails with the API error, which is displayed.

### P5-04 Event status transitions

- **Phase:** 5
- **Priority:** High
- **Status:** DONE
- **Dependencies:** P5-01
- **Backend dependency:** `SCHEDULED` to `CONFIRMED` or `CANCELLED`; `CONFIRMED` to `IN_PROGRESS` or `CANCELLED`; `IN_PROGRESS` to `COMPLETED`
- **Description:** Actions that offer only the legal next statuses.
- **Acceptance criteria:**
  - Terminal statuses show no transition buttons.
  - `IN_PROGRESS` and `COMPLETED` copy can mention that the API sets actual start or end.
  - Illegal statuses are not in the menu.

### P5-05 Soft-delete event

- **Phase:** 5
- **Priority:** Low
- **Status:** DONE
- **Dependencies:** P5-01
- **Backend dependency:** soft-delete only from `SCHEDULED` when no active offers or pending/allocated requests exist. It sets `CANCELLED`.
- **Description:** Confirm dialog for soft-delete on scheduled events.
- **Acceptance criteria:**
  - Hidden outside `SCHEDULED`.
  - Server refusal is shown when offers or requests block it.

### P5-06 Provider queue

- **Phase:** 5
- **Priority:** High
- **Status:** DONE
- **Dependencies:** P1-12
- **Backend dependency:** `GET /api/v1/provider/all-providers`. Paging is not applied (BX-08). Do not build page controls that pretend skip works.
- **Description:** Operator and, later, admin view of providers. Show status. If the array is large, still render it with a note that the API returns an unpaged list.
- **Acceptance criteria:**
  - No page query is presented as working pagination.
  - Status text includes `PENDING_APPROVAL` and `PENDING_EMAIL_VERIFICATION`.
  - This task does not change the backend.

### P5-07 Approve or reject a provider

- **Phase:** 5
- **Priority:** High
- **Status:** DONE
- **Dependencies:** P5-06
- **Backend dependency:** `PATCH /api/v1/provider/approve-provider` and `reject-provider`. Reject reason 3–500 characters. A rejected provider has no re-apply API.
- **Description:** Approve and reject actions. Reject requires a reason.
- **Acceptance criteria:**
  - Approve sets the visible status to `APPROVED` after refetch.
  - Reject without a reason does not submit.
  - Copy does not promise that a rejected email can register again as a provider.

### P5-08 Allocation preview and approve

- **Phase:** 5
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P5-01
- **Backend dependency:** `POST /api/v1/admin/events/:id/allocate` writes nothing. `POST /api/v1/admin/events/:id/approve-allocation` creates reservations. Event must be `SCHEDULED` or `CONFIRMED`. Whole-request match only.
- **Description:** Preview panel, then a separate approve button. Show skipped requests and allocated kilowatts from the approve response.
- **Acceptance criteria:**
  - Preview alone leaves reservation lists unchanged.
  - Approve refreshes reservations and offers.
  - The screen explains all-or-nothing matching and does not offer partial-kW acceptance.
  - `survivalQuotaKw` is not described as enforced.

### P5-09 Reservation status override

- **Phase:** 5
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P5-01
- **Backend dependency:** `PATCH /api/v1/admin/reservations/:id/status`. `FAILED` or `REFUNDED` tries bKash refund only when gateway id and trx id exist, and still writes a local refund if the gateway errors. `CANCELLED` releases capacity only when no payment row exists.
- **Description:** Operator form for status, optional payment status, and resolution text. Copy states the gateway refund is best-effort.
- **Acceptance criteria:**
  - Any reservation status the enum allows can be submitted, matching the API's lack of a transition graph, with a confirm step because the call is destructive.
  - Success refreshes the reservation.
  - The UI does not say the bKash refund succeeded unless the returned payment state shows it.

### P5-10 Operator payment list

- **Phase:** 5
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P1-12
- **Backend dependency:** `GET /api/v1/payments/all`
- **Description:** Read-only payment table for operators with gateway status filters.
- **Acceptance criteria:**
  - Filters match service query params (`gatewayStatus`, and others the service reads).
  - No initiate or refund button on this list (refund stays on P5-09).

### P5-11 Operator request list

- **Phase:** 5
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P1-12
- **Backend dependency:** `GET /api/v1/request/all`
- **Description:** Cross-tenant request list to support allocation review.
- **Acceptance criteria:**
  - Priority and status filters work via URL params.
  - Operator cannot edit a consumer request (no such route).

---

## Phase 6 — Payments

### P6-01 Initiate bKash payment

- **Phase:** 6
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P3-07
- **Backend dependency:** `POST /api/v1/payments/initiate` for an owned reservation in `ALLOCATED` or `PAYMENT_PENDING`. Response includes `bkashURL` and `paymentID`. Provider is bKash only (ADR-007).
- **Description:** Pay action on an eligible consumer reservation. Store nothing about the gateway except navigating with the returned URL in P6-02.
- **Acceptance criteria:**
  - Ineligible statuses hide Pay.
  - 502 shows the API message.
  - No Stripe or SSLCommerz selector exists.

### P6-02 Redirect to bkashURL

- **Phase:** 6
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P6-01
- **Backend dependency:** hosted bKash URL from initiate. Sandbox credentials live only on the API.
- **Description:** Client assigns `window.location` to `data.bkashURL`.
- **Acceptance criteria:**
  - The URL is taken from the initiate response, not built in the client.
  - The page does not embed bKash card fields.

### P6-03 Payment return page

- **Phase:** 6
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-06, P1-01, P6-01
- **Backend dependency:** API redirects to `{FRONTEND_URL}/my-payments?status=success|cancel|failure` after `GET /api/v1/payments/callback`. Query status is not proof. No webhook.
- **Description:** Route exactly `/my-payments`. On load, refetch `GET /payments/my-payments` (or a specific id when known) with `staleTime` 0 and focus refetch enabled on this view. Render the verified gateway status. Show the query value only as "the gateway sent you back with …".
- **Acceptance criteria:**
  - A hand-edited `?status=success` without a `COMPLETED` payment does not show a paid confirmation.
  - Cancel and failure point the consumer back to the reservation to pay again when status returned to `ALLOCATED`.
  - The route is consumer-scoped in the shell.

### P6-04 Consumer payment history

- **Phase:** 6
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P6-03
- **Backend dependency:** `GET /api/v1/payments/my-payments`
- **Description:** List the consumer's payments with gateway status.
- **Acceptance criteria:**
  - Rows show amount, currency `BDT`, and gateway status.
  - The list does not call `/payments/all`.

---

## Phase 7 — Delivery

### P7-01 Provider check-in

- **Phase:** 7
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P4-05
- **Backend dependency:** `POST /api/v1/delivery/:reservationId/provider-check-in` while reservation is `PAYMENT_COMPLETED` or `DELIVERY_PENDING`
- **Description:** Check-in action on the provider's reservation.
- **Acceptance criteria:**
  - Hidden outside the allowed reservation statuses.
  - Success shows delivery `PENDING_CHECKIN` and reservation `DELIVERY_PENDING`.

### P7-02 Provider delivered-kW report

- **Phase:** 7
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P4-05
- **Backend dependency:** `POST /api/v1/delivery/:reservationId/provider-report` with integer `actualDeliveredKw` ≥ 0. Allowed before check-in. Does not by itself change delivery status.
- **Description:** Numeric report form.
- **Acceptance criteria:**
  - Non-integers are blocked.
  - Success shows the stored kilowatts.
  - The UI does not mark delivery confirmed at this step.

### P7-03 Consumer confirm delivery

- **Phase:** 7
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P3-07, P7-02
- **Backend dependency:** `POST /api/v1/delivery/:reservationId/consumer-confirm`. Requires a report. Full delivery confirms. Shortfall sets partial delivery, an open incident, and a local refund without calling bKash (BX-09).
- **Description:** Confirm button. When the report is below allocated kW, the copy says a refund record was created and that bKash is not called.
- **Acceptance criteria:**
  - Confirm is unavailable until a report exists.
  - Full path shows `DELIVERY_CONFIRMED`.
  - Partial path does not say the money was returned by bKash.

### P7-04 Consumer dispute

- **Phase:** 7
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P3-07
- **Backend dependency:** `POST /api/v1/delivery/:reservationId/consumer-dispute` with `disputeReason` at least 5 characters. Delivery becomes `DISPUTED`. Reservation status is unchanged. No incident row is written.
- **Description:** Dispute dialog.
- **Acceptance criteria:**
  - Reason under 5 characters does not submit.
  - Success shows delivery disputed and does not claim the reservation moved to failed or refunded.
  - There is no incident inbox link (BX-04).

### P7-05 Delivery detail

- **Phase:** 7
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P7-01, P7-03
- **Backend dependency:** `GET /api/v1/delivery/:reservationId`. Consumer and provider must own it. Admin and operator may read it.
- **Description:** Shared detail used by the owner role pages. Staff may open it from a reservation row.
- **Acceptance criteria:**
  - A consumer requesting another consumer's reservation sees the API error.
  - Status and `actualDeliveredKw` match the payload.

---

## Phase 8 — Admin

### P8-01 Admin dashboard stats

- **Phase:** 8
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P1-12
- **Backend dependency:** `GET /api/v1/admin/dashboard-stats`. Do not also require `/overview` unless a field is missing. No chart library.
- **Description:** Stat cards for the numbers the payload actually returns (users, providers, events, reservations, payments, revenue, open incidents, refunds total).
- **Acceptance criteria:**
  - One request loads the page.
  - Open incidents and refund totals are labeled as aggregates, not as an incident manager.
  - Operator navigation has no link here.

### P8-02 Admin user list

- **Phase:** 8
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P8-01
- **Backend dependency:** `GET /api/v1/admin/users` with `searchTerm`, `role`, `status`, pagination
- **Description:** User table bound to URL params.
- **Acceptance criteria:**
  - Role and status filters match the enums.
  - Pagination uses `meta`.
  - The list is admin-only.

### P8-03 Admin user detail

- **Phase:** 8
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P8-02
- **Backend dependency:** `GET /api/v1/admin/users/:id`
- **Description:** Detail page for one user.
- **Acceptance criteria:**
  - Shows role, status, and email.
  - Does not show a password field.

### P8-04 Block or unblock a user

- **Phase:** 8
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P8-03
- **Backend dependency:** `PATCH /api/v1/admin/users/:id/block` with `{ isBlocked, reason? }`. Cannot target another admin.
- **Description:** Block and unblock with optional reason (max 500).
- **Acceptance criteria:**
  - Blocking an admin shows the API error.
  - Blocked status is visible after refetch.
  - Copy notes that blocked users fail later API calls with 403.

### P8-05 Soft-delete a user

- **Phase:** 8
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P8-03
- **Backend dependency:** `PATCH /api/v1/admin/users/:id/soft-delete`. Sets deleted status. `checkAuth` does not reject `DELETED`, only `BLOCKED`.
- **Description:** Confirm dialog for soft-delete. The copy must say this marks the account deleted and is not, by itself, a session kill on the API.
- **Acceptance criteria:**
  - Another admin cannot be deleted; the error is shown.
  - The UI does not promise the deleted user is logged out everywhere.

### P8-06 Audit log

- **Phase:** 8
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P8-01
- **Backend dependency:** `GET /api/v1/admin/audit-logs`. Audit rows are not written for every mutation.
- **Description:** Paginated audit table with action and entity filters.
- **Acceptance criteria:**
  - Empty log is an empty state.
  - The page does not claim every click in the app is audited.
  - Operator cannot open it.

### P8-07 Admin allocation without event writes

- **Phase:** 8
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P5-08, P5-09, P8-01
- **Backend dependency:** admin may call allocate, approve-allocation, and reservation status. Admin may `GET /event/all` and must not call event create, update, or status.
- **Description:** Mount the shared allocation and override UI on admin routes. Event list is read-only.
- **Acceptance criteria:**
  - No create, edit, or status control is rendered for admin.
  - Approve allocation still works for an admin session.
  - A direct create request, if someone bypasses the UI, is not something this task adds a client workaround for.

### P8-08 Admin provider approval entry

- **Phase:** 8
- **Priority:** Medium
- **Status:** DONE
- **Dependencies:** P5-06, P5-07, P8-01
- **Backend dependency:** same provider approve routes as the operator
- **Description:** Link the provider queue into the admin shell, reusing P5-06 and P5-07 components.
- **Acceptance criteria:**
  - Admin can approve and reject.
  - The unpaged-list limitation from BX-08 is still visible.
  - No second copy of the approve form is maintained.

---

## Phase 9 — Hardening

### P9-01 Mobile navigation and accessibility

- **Phase:** 9
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P1-12 and the role pages that exist when this runs
- **Backend dependency:** none
- **Description:** Pass the shells and the primary forms at a phone width and with keyboard only. Status badges include text. Form errors tie to inputs.
- **Acceptance criteria:**
  - Sidebar is usable without hover.
  - A keyboard user can submit login, request create, and logout.
  - Focus is visible on interactive controls.

### P9-02 Empty, error, and loading states

- **Phase:** 9
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** the list pages in phases 3–8
- **Backend dependency:** none
- **Description:** Each list and detail view uses the shared empty, error, and skeleton components. Query `isError` stays inside the page.
- **Acceptance criteria:**
  - A 500 does not blank the sidebar.
  - Empty copies are specific ("No offers on this event"), not a single generic string everywhere.

### P9-03 Cross-role browser pass

- **Phase:** 9
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P1-04, role features through phase 8 that are `DONE`
- **Backend dependency:** role middleware
- **Description:** With demo logins, walk consumer, provider, operator, and admin through their primary path, then open another role's URL.
- **Acceptance criteria:**
  - Each role completes its allowed primary path or records a backend blocker without faking success.
  - Cross-role URLs redirect or show 403, and do not mutate.
  - Notes from the pass are written into this task when it moves to `REVIEW` or `DONE`.

### P9-04 API error mapping

- **Phase:** 9
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P0-04
- **Backend dependency:** error envelope, 409 unique conflicts, 429 rate limits
- **Description:** Confirm forms and lists show 400 validation text, 401 session loss, 403 permission, 409 conflicts (request uniqueness, duplicate license), and 429 without a retry loop.
- **Acceptance criteria:**
  - 429 copy is the server message.
  - The consumer duplicate-request 409 remains understandable after P3-04.
  - OTP values still never hit the console.

### P9-05 Token exposure review

- **Phase:** 9
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P0-05, P1-03, P1-10
- **Backend dependency:** tokens in the Express JSON body must be stripped at the BFF
- **Description:** Review the client bundle and browser storage after login, refresh, Google login, and both OTP verifies.
- **Acceptance criteria:**
  - `localStorage` and `sessionStorage` have no access or refresh token.
  - Cookie flags on the Next origin are `httpOnly`.
  - Documented `document.cookie` in app code does not read the token.

---

## Phase 10 — Deployment

### P10-01 Production build and env checklist

- **Phase:** 10
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P9-05
- **Backend dependency:** `FRONTEND_URL` must equal the deployed Next origin. `BKASH_CALLBACK_URL` stays on the API.
- **Description:** `next build` succeeds. Document the production env names, not secret values, in the frontend README or the root README deployment section.
- **Acceptance criteria:**
  - Build output has no type errors.
  - The checklist names `API_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, and `NEXT_PUBLIC_DEMO_LOGIN=false`.
  - Demo login is off in the production example.

### P10-02 Deploy the frontend

- **Phase:** 10
- **Priority:** Medium
- **Status:** TODO
- **Dependencies:** P10-01
- **Backend dependency:** API CORS origin updated to the real frontend origin. This task does not edit the API unless the user asks.
- **Description:** Deploy the Next.js app to the host the user chooses. Record the URL in the README only after it is live.
- **Acceptance criteria:**
  - The deployed site can log in to the deployed or agreed API.
  - README does not claim a URL before the deploy exists.
  - `NEXT_PUBLIC_DEMO_LOGIN` is not true on that host.

### P10-03 Production cookie and CORS check

- **Phase:** 10
- **Priority:** High
- **Status:** TODO
- **Dependencies:** P10-02
- **Backend dependency:** CORS `FRONTEND_URL` and bKash redirect base
- **Description:** On the deployed origin, confirm login sets `Secure` cookies, `/my-payments` is the bKash return path, and a cross-role URL still fails closed.
- **Acceptance criteria:**
  - Authenticated API calls from the hosted app succeed for the matching role.
  - Cookies are `Secure` on HTTPS.
  - A payment return URL on the wrong host is called out as a backend `FRONTEND_URL` mismatch, not patched by trusting the query string.

---

## Blocked backend work

Do not implement these. If a product request matches one, leave it `BLOCKED` and point at the backend change.

### BX-01 Password reset and change

- **Phase:** blocked
- **Priority:** High
- **Status:** BLOCKED
- **Dependencies:** none
- **Backend dependency:** no forgot, reset, or change-password route. `needPasswordChange` is unused.
- **Description:** Account recovery.
- **Required backend change:** routes to request and confirm a reset, and optionally change password while authenticated.
- **Acceptance criteria:** none until those routes exist. Do not add a form that pretends email was sent.

### BX-02 OTP resend

- **Phase:** blocked
- **Priority:** Medium
- **Status:** BLOCKED
- **Dependencies:** P1-05
- **Backend dependency:** no resend endpoint. OTP TTL is 5 minutes. Register again may be the only retry, and it can conflict if a pending key or user already exists. Do not guess.
- **Description:** Resend verification code.
- **Required backend change:** an explicit resend that rotates the Redis OTP.
- **Acceptance criteria:** no resend control in the verify UI.

### BX-03 Ratings

- **Phase:** blocked
- **Priority:** Low
- **Status:** BLOCKED
- **Dependencies:** none
- **Backend dependency:** `Rating` model only. No module or routes. MVP notes place ratings in a later phase.
- **Description:** Rate a provider after delivery.
- **Required backend change:** create and read rating endpoints.
- **Acceptance criteria:** no ratings UI.

### BX-04 Incident management

- **Phase:** blocked
- **Priority:** Low
- **Status:** BLOCKED
- **Dependencies:** none
- **Backend dependency:** incidents are insert-only side effects. No list or resolve routes. `GRID_STAYED_ON` and `OTHER` are never written. Dispute does not write an incident.
- **Description:** Staff incident inbox.
- **Required backend change:** list and update incident endpoints.
- **Acceptance criteria:** admin stats may show a count only. No inbox.

### BX-05 Zones and standing offers

- **Phase:** blocked
- **Priority:** Low
- **Status:** BLOCKED
- **Dependencies:** none
- **Backend dependency:** live offers require `eventId`. Zones exist only in the stale root schema and assignment drafts.
- **Description:** Zone matching and offers that are not tied to an event.
- **Required backend change:** schema and routes the running server does not have.
- **Acceptance criteria:** no zone picker and no standing-offer form.

### BX-06 SSLCommerz or Stripe

- **Phase:** blocked
- **Priority:** High
- **Status:** BLOCKED
- **Dependencies:** none
- **Backend dependency:** not implemented. bKash is the live provider (ADR-007). Drafts in `files/` are not a spec for new frontend code.
- **Description:** Alternate card or SSLCommerz checkout.
- **Required backend change:** a real gateway module and initiate/callback contract.
- **Acceptance criteria:** no alternate provider UI.

### BX-07 Seeded provider can create an offer immediately

- **Phase:** blocked
- **Priority:** High
- **Status:** BLOCKED
- **Dependencies:** P4-03
- **Backend dependency:** `../power-mesh-server/src/utils/seed.ts` sets `verified: true` and does not set `Provider.status`, so the default `PENDING_EMAIL_VERIFICATION` remains. `createOffer` requires `APPROVED`.
- **Description:** One-click provider demo that can create an offer without a prior approval call.
- **Required backend change:** seed `status: APPROVED` (and keep `verified` consistent), or document that an operator must approve first. The frontend gate in P4-01 is still required either way.
- **Acceptance criteria:** do not locally force status to `APPROVED` in the client.

### BX-08 Paged provider list

- **Phase:** blocked
- **Priority:** Medium
- **Status:** BLOCKED
- **Dependencies:** P5-06
- **Backend dependency:** `GET /api/v1/provider/all-providers` parses page and limit and does not pass skip/take.
- **Description:** Working pagination for all providers.
- **Required backend change:** apply `skip` and `take` and return `meta` the way other lists do.
- **Acceptance criteria:** P5-06 must not invent page buttons that imply paging works.

### BX-09 bKash partial-delivery refund

- **Phase:** blocked
- **Priority:** Medium
- **Status:** BLOCKED
- **Dependencies:** P7-03
- **Backend dependency:** shortfall writes a `Refund` row and an incident and does not call bKash or change payment status. Refund rows have no status field (the enum field is commented out in the schema).
- **Description:** Gateway refund of the undelivered amount.
- **Required backend change:** call the refund API for the shortage and persist gateway refund id and status.
- **Acceptance criteria:** P7-03 copy stays honest. This task adds no "refund sent to bKash" success state.

### BX-10 Refresh-token revocation

- **Phase:** blocked
- **Priority:** Medium
- **Status:** BLOCKED
- **Dependencies:** P1-10
- **Backend dependency:** refresh tokens are not stored or revoked. Logout only clears cookies. A copied JSON token works until expiry.
- **Description:** Server-side logout of other sessions.
- **Required backend change:** a refresh-token store and revocation on logout and password change.
- **Acceptance criteria:** the BFF still withholds tokens from the browser. The UI does not claim global revocation.
