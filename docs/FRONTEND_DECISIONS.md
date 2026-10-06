# Frontend Architecture Decisions

Decisions for the PowerMesh Next.js app. Facts that motivated them are in `FRONTEND_PLAN.md`. If a later change contradicts a decision, update this file before the code, and set the old decision to `Superseded`.

---

## ADR-001 — Next.js App Router

- **Status:** Accepted
- **Context:** The frontend is a new app against a role-split Express API. Screens differ by who may open them. The bKash return URL is a fixed path, `/my-payments`.
- **Decision:** Use the Next.js App Router with source under `src/app`. Route groups are `(public)` and `(dashboard)` only. Marketing, login, and both registration flows live in `(public)`. Role homes are real segments under `(dashboard)`: `/consumer`, `/provider`, `/operator`, `/admin`. Dynamic segments exist only for ids the API already uses. `loading.tsx`, `error.tsx`, and root `not-found.tsx` are part of the shell from the start. Navigation metadata lives in `src/routes`, not in the route group folders.
- **Reasoning:** Two groups keep the public shell and the dashboard shell apart without adding an `(auth)` group that does not change the URL. `/my-payments` stays the path the API already redirects to because route groups do not affect the URL.
- **Consequences:** Middleware and `src/routes` must agree on the four prefixes. Login is a `(public)` page. Adding a role later means a new segment and a new file in `src/routes`.
- **Alternatives considered:** A separate `(auth)` group was the earlier plan and is superseded by this two-group layout. A single `/dashboard` with client-side role switching was rejected because `ADMIN` and `OPERATOR` are not the same permission set.

## ADR-002 — Static pages, client islands

- **Status:** Accepted
- **Context:** Pages should stay fast. Most of a screen is content. Buttons, forms, and live lists are the parts that need the browser.
- **Decision:** Every `page.tsx` and `layout.tsx` is a static Server Component. Do not add `"use client"` to those files. Interactive pieces are Client Components rendered inside the page: forms, buttons that mutate, dialogs, table filters, the sidebar toggle, TanStack Query lists, Google sign-in, the profile file input, and the control that sets `window.location` to `bkashURL`. Middleware performs the role redirect so dashboard pages do not call `cookies()` and do not become dynamic by reading the session.
- **Reasoning:** A static page ships less JavaScript. Hydration is limited to the control the user actually touches. Reading the session cookie inside the page would force that route to render dynamically on every request, which works against the static page.
- **Consequences:** `src/api` and `src/lib` must not import React. Reviewers should reject a page whose first line is `"use client"` when only a button needs it. Fresh marketplace data lives in the client island, not in a static HTML snapshot, because the API does not push cache tags.
- **Alternatives considered:** Marking the whole dashboard page `"use client"` was rejected because the static shell does not need to hydrate. Prefetching every list in a dynamic Server Component was the earlier plan. It is superseded here so the page document stays static and the live region is the island.

## ADR-003 — TanStack Query + Zustand for UI prefs

- **Status:** Accepted (amended)
- **Context:** The API is the owner of users, events, offers, requests, reservations, payments, and delivery. Assignment rubrics also expect a named global client store.
- **Decision:** TanStack Query holds every API resource, including `['me']`, inside the client island that renders it. Query keys include scope and list params. URL search params hold `page`, `limit`, `status`, `searchTerm`, `eventId`, and the payment return `status`. Dialogs and wizard steps use local React state. **Zustand** (`src/stores/ui-prefs.store.ts`) holds UI-only prefs (sidebar open). Do not put JWTs or API lists in Zustand.
- **Reasoning:** Copying server rows into a global store creates two caches that drift. A thin UI store satisfies the global-state requirement without becoming a second server cache.
- **Consequences:** Mutations must invalidate specific Query keys. `staleTime` is 5 minutes for `me`, 60 seconds for events and offers, 15 seconds for reservations and delivery, and 0 for the payment-return refetch. `refetchOnWindowFocus` is off except payment return and in-progress delivery. `gcTime` is 10 minutes.
- **Alternatives considered:** Redux or a Zustand domain store for API rows was rejected as a second server cache. Keeping sidebar only in local React state failed the rubric’s “global state management” wording.

## ADR-004 — Authentication and token handling

- **Status:** Accepted
- **Context:** Login, verify, Google login, and refresh return JWTs in `httpOnly` cookies and in the JSON body. Those cookies are `SameSite=None` and `Secure=false`, which browsers drop. There is no refresh-token revocation. `checkAuth` trusts the JWT role and rejects only `BLOCKED` users. Logout is public and clears cookies without matching flags.
- **Decision:** The browser never stores access or refresh tokens in `localStorage`, `sessionStorage`, or a readable cookie. The Next.js server keeps first-party `httpOnly` cookies (`SameSite=Lax`, `Secure` in production) and attaches `Authorization: Bearer` when it calls Express. The response to the browser after login is the user profile from `GET /api/v1/users/me`, not the tokens. Middleware reads the cookie only to redirect. Dashboard pages do not read it. Express remains the authorization authority. Google's client secret stays on the API. The frontend public env holds the Google client id only.
- **Reasoning:** Readable token storage is the XSS path the JSON body creates. Treating middleware as authorization would hide 403s until a request fails, and it would drift from route rules. Using `/auth/me` would drop provider and operator profiles.
- **Consequences:** Every authenticated browser call goes through the Next server (ADR-005). Demo login uses the same path as password login. A token copied from a direct API response is still valid until expiry; the app must not be the thing that copies it into the page. Soft-deleted users can still pass `checkAuth`; the UI must not claim that soft-delete kills the session.
- **Alternatives considered:** Calling Express from the browser with `credentials: "include"` was rejected because the API cookie flags are invalid in browsers and, on a cross-site production host, those cookies would not be visible to Next middleware anyway. Bearer tokens in `localStorage` were rejected because of XSS.

## ADR-005 — Same-origin BFF

- **Status:** Accepted
- **Context:** The Express origin and the Next origin differ in production (and by port locally). The API already returns tokens to whoever calls login. Payment and auth routes are rate-limited.
- **Decision:** Browser code calls only same-origin Next routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`, and `/api/proxy/[...path]`. The implementation lives in `src/api`. `src/app/api/**/route.ts` is a thin mount, because Next.js only executes route handlers that sit under `app/`. Those handlers call Express with `API_URL`. Auth handlers strip tokens from the body they return and set the first-party cookies. State-changing handlers reject a mismatched `Origin`. No extra CSRF token while cookies stay `SameSite=Lax`.
- **Reasoning:** Introducing the BFF later means rewriting every caller. Doing it first lets Server Components and middleware see the session without putting the JWT in JavaScript. `SameSite=Lax` blocks cross-site POST from attaching the cookie, which covers the CSRF case for this app.
- **Consequences:** `API_URL` is server-only. The proxy must stream status codes and the `{ success, message, data, meta }` / `{ success, message, errors }` envelopes through unchanged. 429 responses must be shown, not retried in a loop. Cookie `Secure` must be on when the site is HTTPS.
- **Alternatives considered:** A rewrite in `next.config` that forwards cookies untouched was rejected because the API's `Set-Cookie` attributes are not browser-safe; the auth handlers need to reissue cookies. A public Express URL in `NEXT_PUBLIC_API_URL` was rejected with ADR-004.

## ADR-006 — Four separate roles

- **Status:** Accepted
- **Context:** The enum is `CONSUMER`, `PROVIDER`, `OPERATOR`, and `ADMIN`. Event create, update, status, and soft-delete are operator-only. User admin, audit, and dashboard stats are admin-only. The server README says admin includes every operator ability. The routes do not. A user has one role. The seeded admin also has an operator row, but the JWT role is `ADMIN`.
- **Decision:** Four shells and four URL prefixes. Shared allocation, provider approval, and reservation override UI can be one feature mounted on both operator and admin routes. Event create and status controls render only for `OPERATOR`. User management and audit render only for `ADMIN`. The consumer and the provider never see those actions. Middleware sends each role to its own home.
- **Reasoning:** Hiding the operator/admin split would produce buttons that always 403, and it would train reviewers to think the README's "admin can do everything" line is true. One signup form that posts a role would be ignored or rejected; registration does not accept a role.
- **Consequences:** Demo login includes the operator account, because events cannot be created without it. Navigation tests must include an admin opening an operator write URL and receiving a redirect or a 403 from the API, not a successful create.
- **Alternatives considered:** One operations dashboard for both staff roles was rejected for the permission mismatch above. Mapping the seeded admin to operator routes was rejected because `checkAuth` uses the JWT role.

## ADR-007 — bKash is the payment provider

- **Status:** Accepted
- **Context:** `power-mesh-server` implements bKash Tokenized Checkout: initiate returns `bkashURL` and `paymentID`, the public callback executes the payment, and the API redirects to `{FRONTEND_URL}/my-payments?status=...`. There is no Stripe code and no SSLCommerz client. `files/` and root `prisma-schema.prisma` still name SSLCommerz, and some of those drafts also mention Stripe as an allowed alternative. Partial-delivery refunds write a local row and do not call bKash. `bkash.queryPayment` is unused. There is no webhook POST.
- **Decision:** The frontend integrates that bKash flow only. The return page is exactly `/my-payments`. The query string is a hint. The page renders success, cancel, or failure only after reading `GET /payments/my-payments` or `GET /payments/:id`. The UI never builds a bKash payload and never stores `BKASH_*`. Partial delivery copy says a refund was recorded locally. Staff refunds stay on the reservation status override, which is the only path that attempts `bkash.refundPayment`.
- **Reasoning:** A SSLCommerz or Stripe screen would call endpoints that do not exist. Silently editing the old drafts would hide a real conflict between the assignment notes and the product that was built.
- **Consequences:** `FRONTEND_URL` on the API must be the Next origin so the callback lands on `/my-payments`. Sandbox bKash must be available to finish a payment test. Gateway partial refund remains blocked (`BX-09`).
- **Alternatives considered:** Implementing SSLCommerz in the frontend was rejected. Adding a multi-gateway adapter now was rejected. The payment client component is the only seam if the API adds another provider later.

## ADR-008 — Performance and caching

- **Status:** Accepted (amended)
- **Context:** Express allows 200 requests per 15 minutes per IP, and 30 on auth, provider, and payments. Lists already default to 10 rows. Admin stats are counts, not time series. Shared staff catalogs change slowly; personalized rows must not be CDN-cached per user.
- **Decision:** Use **ISR** (`revalidate` + cache tags + `ISR_SERVICE_TOKEN`) for shared catalogs (providers, admin events/users/audit, operator requests/payments, available events). Use **SSR** (`cookies()` + hydrate) for personalized “mine” pages, profiles, allocation, delivery, and `/my-payments`. Do not ISR personalized payment or reservation rows. Keep TanStack Query in client islands for mutations and filter changes. Debounce search. Leave `refetchOnWindowFocus` off except payment return and in-progress delivery. Use `next/font` and `next/image`.
- **Reasoning:** Shared catalogs are identical for every staff user behind middleware, so ISR is safe and cuts waterfalls. Personalized HTML must stay per-request. Rate limits still dominate.
- **Consequences:** Set matching `ISR_SERVICE_TOKEN` on Next and Express for build-time/ISR prefetch. Without it, ISR pages fall back to client Query. Approve/reject calls `updateTag('providers')`.
- **Alternatives considered:** Client-only fetch for all lists (earlier ADR) left no data in the static HTML. Full-page SSR of every dashboard route burned the rate budget.

## ADR-009 — `src` layout

- **Status:** Accepted
- **Context:** The API is modular. The frontend source needs one agreed tree: `api`, `app`, `assets`, `components`, `hooks`, `lib`, `providers`, `routes`, `types`, `utils`, and `validation`.
- **Decision:** This repository is the Next.js app root, with source under `src/`. `src/app` holds pages and layouts. `src/api` holds BFF modules. `src/components` holds shared UI (`ui/`), shells (`shell/`), and screen modules (`modules/`). Under `modules/`, `dashboard/` holds shared dashboard widgets; feature folders such as `auth`, `approve-provider`, `profile`, `payments`, and role folders hold screen components. `src/hooks` holds shared hooks. `src/lib` holds non-React helpers. `src/providers` holds the Query provider. `src/stores` holds Zustand UI prefs. `src/routes` holds one path map per role. `src/types` holds enums and shared types. `src/utils` holds pure helpers. `src/validation` holds Zod mirrors. `src/assets` holds static files that are imported by the app. There is no `features/` tree and no `schemas/` tree.
- **Reasoning:** A second `services/` or `features/` tree would split the same screen across two conventions. Path maps in `src/routes` stay out of `src/app` so navigation labels do not get mixed with page files.
- **Consequences:** A screen component may import `src/components`, `src/hooks`, and types. It should not import another page. Allocation UI used by operator and admin is one component mounted by both pages. Zod stays in `src/validation`, not beside the page.
- **Alternatives considered:** A `features/` directory per API module was the earlier plan. It is superseded by this `src` tree. Colocating every component under `src/app` was rejected because Zod, path maps, and BFF modules are not pages.

## ADR-011 — Route groups and role path maps

- **Status:** Accepted
- **Context:** The app needs a public shell and a dashboard shell. The requested path maps are `admin.routes` and `provider.routes`. The API also has consumer and operator.
- **Decision:** `src/app` contains `(public)` and `(dashboard)` only. `src/routes` contains `admin.routes.ts`, `provider.routes.ts`, `consumer.routes.ts`, and `operator.routes.ts`. Each file exports that role's paths and labels. Dashboard nav reads the file that matches the session role. These files are not Next.js route handlers and do not contain `page.tsx`.
- **Reasoning:** `(public)` covers marketing and auth screens without a third group. Four route files match the four roles. Omitting consumer and operator would leave their nav without a home while admin and provider had one.
- **Consequences:** Adding a link means editing the role file and adding a page under `src/app/(dashboard)/<role>`. Admin links must not include event create. Operator links must not include user admin.
- **Alternatives considered:** Only `admin.routes` and `provider.routes` would match the two names called out first, and would leave consumer and operator without the same pattern. That alternative is rejected. Putting path strings only inside `page.tsx` files would scatter the nav.

## ADR-010 — Backend source of truth

- **Status:** Accepted
- **Context:** Assignment drafts, the server README, the MVP HTML, and the route handlers disagree in specific places (payment provider, admin versus operator, Bearer-only wording versus cookies plus JSON, seeded provider status).
- **Decision:** When a document and `../power-mesh-server/src` or `../power-mesh-server/prisma/schema` disagree, the code wins. The frontend mirrors mounted Zod bodies, role middleware, and status transitions. It does not invent endpoints, roles, or success states. A missing capability becomes a `BLOCKED` task and a note in `FRONTEND_PLAN.md`, not a client simulation. Stale drafts in `../files/` stay as history; they are not edited to match the server as part of frontend work.
- **Reasoning:** The UI can only succeed at calls the server implements. Papering over a conflict trains the next agent to call the wrong route.
- **Consequences:** Agents re-read the controller, service, and validation file for the task they are implementing. Form rules that look harsh (consumer first name max 10) stay until the API changes. Product ideas from the MVP HTML that have no route (ratings, zones, pay window) stay out of scope.
- **Alternatives considered:** Treating `../files/MASTER-CHECKLIST.md` as the spec was rejected because it requires SSLCommerz and three roles. Treating the server README as higher than the routers was rejected because event writes are operator-only in code.

---

## Form library note

React Hook Form with Zod is the form library for this plan (ADR-002, ADR-009). TanStack Form is not an accepted decision. Introducing it requires a new ADR.
