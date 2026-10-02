# Frontend Architecture Decisions

Decisions for the PowerMesh Next.js app. Facts that motivated them are in `FRONTEND_PLAN.md`. If a later change contradicts a decision, update this file before the code, and set the old decision to `Superseded`.

---

## ADR-001 — Next.js App Router

- **Status:** Accepted
- **Context:** The frontend is a new app against a role-split Express API. Screens differ by authentication, SEO, and data freshness. The bKash return URL is a fixed path, `/my-payments`.
- **Decision:** Use the Next.js App Router. Marketing is a static route. Authenticated areas use route groups `(public)`, `(auth)`, and `(dashboard)` so layouts differ without changing URLs. Role homes are real segments: `/consumer`, `/provider`, `/operator`, `/admin`. Dynamic segments exist only for ids the API already uses. `loading.tsx`, `error.tsx`, and root `not-found.tsx` are part of the shell from the start.
- **Reasoning:** Route groups give each role a layout while `/my-payments` stays the path the API already redirects to. The Pages Router would not match the component and rendering model in ADR-002.
- **Consequences:** Middleware and layouts must agree on those four prefixes. Adding a role later means a new segment and a nav map, not a flag inside one dashboard.
- **Alternatives considered:** A single `/dashboard` with client-side role switching was rejected because `ADMIN` and `OPERATOR` are not the same permission set, and a shared page would keep rendering actions the API rejects.

## ADR-002 — Server Components by default

- **Status:** Accepted
- **Context:** Most pages are data plus a few interactive controls. Marketplace lists are private and change often. Marketing is public and stable.
- **Decision:** Server Components are the default. `page.tsx` files stay server components and render a client island for the interactive part. A Client Component is allowed only for interactivity, browser APIs, React state, TanStack Query, Zustand, React Hook Form, Google Identity Services, file upload, or assigning `window.location` to a bKash URL.
- **Reasoning:** Shipping query and form code on every route increases hydration cost without helping static or layout code. The event page can start parallel server reads instead of nesting client effects.
- **Consequences:** `lib/api` must not import React, so route handlers and server components can share it. Developers will be tempted to mark a whole page `"use client"` when only the table is interactive. Reviewers should push the client boundary down.
- **Alternatives considered:** Client-only dashboards (every page fetches in the browser) were rejected because they prevent a server prefetch and make the session cookie harder to keep off the client. Full SSR without TanStack Query was rejected because mutations, pagination, and the payment return need a client cache.

## ADR-003 — TanStack Query and Zustand

- **Status:** Accepted
- **Context:** The API is the owner of users, events, offers, requests, reservations, payments, and delivery. The UI also has a small amount of chrome state.
- **Decision:** TanStack Query holds every API resource, including `['me']`. Query keys include scope and list params. Zustand holds sidebar collapsed state and nothing else. URL search params hold `page`, `limit`, `status`, `searchTerm`, `eventId`, and the payment return `status`. Dialogs and in-progress form steps use local React state.
- **Reasoning:** Copying server rows into a global store creates two caches that drift, and it invites putting tokens next to them. The API already pages and filters with query strings, so the URL is the right place for that state.
- **Consequences:** Mutations must invalidate specific keys. `staleTime` is 5 minutes for `me`, 60 seconds for events and offers, 15 seconds for reservations and delivery, and 0 for the payment-return refetch. `refetchOnWindowFocus` is off except payment return and in-progress delivery, because the API allows 200 requests per 15 minutes. `gcTime` is 10 minutes.
- **Alternatives considered:** Redux or a global Zustand domain store was rejected as a second server cache. Putting filters only in component state was rejected because back navigation and shared links would drop them.

## ADR-004 — Authentication and token handling

- **Status:** Accepted
- **Context:** Login, verify, Google login, and refresh return JWTs in `httpOnly` cookies and in the JSON body. Those cookies are `SameSite=None` and `Secure=false`, which browsers drop. There is no refresh-token revocation. `checkAuth` trusts the JWT role and rejects only `BLOCKED` users. Logout is public and clears cookies without matching flags.
- **Decision:** The browser never stores access or refresh tokens in `localStorage`, `sessionStorage`, Zustand, or a readable cookie. The Next.js server keeps first-party `httpOnly` cookies (`SameSite=Lax`, `Secure` in production) and attaches `Authorization: Bearer` when it calls Express. The response to the browser after login is the user profile from `GET /api/v1/users/me`, not the tokens. Middleware reads the cookie only to redirect. Express remains the authorization authority. Google's client secret stays on the API. The frontend public env holds the Google client id only.
- **Reasoning:** Readable token storage is the XSS path the JSON body creates. Treating middleware as authorization would hide 403s until a request fails, and it would drift from route rules. Using `/auth/me` would drop provider and operator profiles.
- **Consequences:** Every authenticated browser call goes through the Next server (ADR-005). Demo login uses the same path as password login. A token copied from a direct API response is still valid until expiry; the app must not be the thing that copies it into the page. Soft-deleted users can still pass `checkAuth`; the UI must not claim that soft-delete kills the session.
- **Alternatives considered:** Calling Express from the browser with `credentials: "include"` was rejected because the API cookie flags are invalid in browsers and, on a cross-site production host, those cookies would not be visible to Next middleware anyway. Bearer tokens in `localStorage` were rejected because of XSS.

## ADR-005 — Same-origin BFF

- **Status:** Accepted
- **Context:** The Express origin and the Next origin differ in production (and by port locally). The API already returns tokens to whoever calls login. Payment and auth routes are rate-limited.
- **Decision:** Browser code calls only same-origin Next routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`, and `/api/proxy/[...path]`. Those handlers call Express with `API_URL`. Auth handlers strip tokens from the body they return and set the first-party cookies. State-changing handlers reject a mismatched `Origin`. No extra CSRF token while cookies stay `SameSite=Lax`.
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
- **Alternatives considered:** Implementing SSLCommerz in the frontend was rejected. Adding a multi-gateway adapter now was rejected; `features/payments` is the only seam if the API adds another provider later.

## ADR-008 — Performance and caching

- **Status:** Accepted
- **Context:** Express allows 200 requests per 15 minutes per IP, and 30 on auth, provider, and payments. Lists already default to 10 rows. Admin stats are counts, not time series. There is no websocket and no cache-tag webhook.
- **Decision:** Do not use ISR for marketplace data. Prefetch the active list on the server and dehydrate it into TanStack Query. Keep one `['me']` query for the shell. Debounce search. Leave `refetchOnWindowFocus` off except where ADR-003 allows it. Do not add a chart library or list virtualization in the first build. Use `next/font` and `next/image`. Code-split Google and the payment return by route.
- **Reasoning:** The rate limit and duplicate waterfalls will hurt before bundle size does. Caching personalized reservation data on a static page would show another user's state or stale payment status.
- **Consequences:** A very large admin user list stays on API pagination. If a later task removes pagination, virtualization can be reconsidered then. Dashboard "charts" are stat cards bound to `dashboard-stats`.
- **Alternatives considered:** Client refetch on every focus was rejected because of the 200-request budget. SWR instead of TanStack Query was rejected to keep one server-state library (ADR-003).

## ADR-009 — Feature-oriented frontend layout

- **Status:** Accepted
- **Context:** The API is already modular (`auth`, `event`, `offer`, `request`, `reservation`, `payment`, `delivery`, `provider`, `admin`, `user`). The UI follows those workflows.
- **Decision:** This repository is the Next.js app root. `features/<domain>` holds the screens and hooks for that API module. `components/ui` is shadcn. `components/shell` and `components/states` are shared chrome. `lib/api` plus `app/api` are the only service layer. Zod mirrors live in `schemas`. Enums live in `types/enums.ts`. `store/ui-store.ts` is the only Zustand store. Shared hooks live in `hooks` only when two features use them. Do not add a nested `frontend/` package.
- **Reasoning:** A type-based root (`components`, `hooks`, `services` for everything) splits one reservation flow across too many trees. A second services folder would duplicate the BFF client.
- **Consequences:** A feature may import shared UI and `lib/api`. It should not import another feature's page. Allocation UI used by operator and admin should sit in one feature module and be mounted by both routes, rather than copied.
- **Alternatives considered:** Colocation of every component under `app/` was rejected because client islands and Zod schemas would be awkward to share with route handlers. A generic `services/` directory was rejected above.

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
