# PowerMesh

PowerMesh is a marketplace for backup power during scheduled outages. Consumers request kilowatts, providers offer generation or storage capacity, and operators match them for a specific outage event. Payment uses bKash. Delivery is confirmed by the people on each side of the reservation.

The backend API is the sibling repository [`power-mesh-server`](../power-mesh-server). This repository is the frontend. The Next.js app is planned and not scaffolded yet.

## Problem it solves

When the grid schedules an outage, a facility still needs a known amount of backup power, and a capacity owner needs a buyer for that window. PowerMesh coordinates that match: an operator publishes the event, providers attach priced offers, consumers submit a prioritized request, and an allocation step reserves kilowatts before anyone pays. It does not control the grid and it does not operate the generator.

## How PowerMesh works

1. An operator creates an outage event with a time window and a total capacity.
2. An approved provider creates an offer on that event: kilowatts, price per kWh, and a delivery window.
3. A consumer picks the event and submits one capacity request (kilowatts, max price, priority tier).
4. An operator or admin previews allocation, then approves it. Matching is whole-request: higher priority first, then older requests, then the cheapest offer that can cover the request under the consumer's max price. A consumer can also reserve a specific offer and request directly.
5. The consumer pays the reservation through bKash. The hosted page returns through the API callback, which sends the browser to `/my-payments`.
6. The provider checks in and reports delivered kilowatts. The consumer confirms full delivery, or a shortfall, or opens a dispute.
7. An admin or operator can override reservation status. A full failure or refund status can attempt a bKash refund when a transaction id exists. A shortfall currently records a local refund row and does not call bKash.

One account has one role. A consumer and a provider are different users.

## User roles

The API enforces four roles. Route middleware is the contract. The server README's line that admin can do "everything operator" does not match the routes: admins cannot create or update events.

| Role | What they actually do |
| --- | --- |
| Consumer | Register, browse available events and offers, create one request per event, reserve, pay with bKash, confirm or dispute delivery, edit their profile. |
| Provider | Apply and verify email, wait for approval, then create and manage offers. Check in and report delivered kilowatts on their reservations. |
| Operator | Create and manage their own outage events, approve or reject providers, preview and approve allocation, list cross-tenant marketplace data, override reservation status. No user administration and no audit log. |
| Admin | User list, block, and soft-delete; dashboard stats; audit log; provider approval; allocation; reservation override. No event create, update, or status change. |

Public visitors can read the marketing page and create an account. Event and offer lists require a logged-in role.

## Key features

### Implemented (backend)

- Email and password login, consumer and provider OTP registration, Google sign-in for consumers.
- JWT access and refresh tokens, returned in JSON and set as cookies.
- Events, offers, capacity requests, reservations, allocation preview and approval.
- bKash tokenized checkout: initiate, browser callback, payment reads.
- Delivery check-in, delivered-kW report, consumer confirm and dispute.
- Admin stats, user block and soft-delete, audit log read.
- Demo users seeded in development.

### Planned (frontend)

- Next.js app with role-specific dashboards, documented in [`docs/FRONTEND_PLAN.md`](docs/FRONTEND_PLAN.md).
- Same-origin session so the browser does not store JWTs in JavaScript.
- One-click development login for the seeded admin, provider, consumer, and operator accounts.
- bKash payment start and a `/my-payments` return page that checks payment status with the API.

Nothing in the planned frontend list is built yet.

### Backend-dependent (do not present as available)

- Password reset and OTP resend.
- Ratings, incident inbox, service zones, standing offers.
- SSLCommerz or Stripe checkout.
- bKash refund of a partial delivery (the API writes a local refund row only).
- Paging of `GET /api/v1/provider/all-providers` (the handler does not apply skip and take).
- Immediate offer creation by the seeded provider (the seed marks the provider verified but leaves status at `PENDING_EMAIL_VERIFICATION`; offer create requires `APPROVED`).

## Technology stack

**Backend (implemented):** Node.js, Express 5, TypeScript, PostgreSQL, Prisma 7, Redis, Zod, JWT, Google ID tokens, bKash Tokenized Checkout, Nodemailer, Cloudinary, Helmet, CORS, rate limiting.

**Frontend (planned):** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand for shell UI only, React Hook Form, Zod, bKash hosted checkout via the existing initiate URL.

## Architecture

The browser talks to the Next.js app. Next.js route handlers call the Express API and set first-party `httpOnly` cookies. Express remains the authorization authority. Next.js middleware only chooses which screen to show.

Marketplace data is loaded with TanStack Query. Pages stay Server Components and hand interactive pieces (forms, tables, payment redirect) to small client components.

The technical plan, API map, and folder layout are in [`docs/FRONTEND_PLAN.md`](docs/FRONTEND_PLAN.md). Decisions are in [`docs/FRONTEND_DECISIONS.md`](docs/FRONTEND_DECISIONS.md).

```text
Browser → Next.js (UI + BFF cookies) → Express /api/v1 → PostgreSQL
                                              ↘ Redis (OTP, bKash token cache)
                                              ↘ bKash sandbox / checkout
```

## Authentication and security

Login, consumer verify, provider verify, and Google login issue an access token and a refresh token. The API sets `accessToken` and `refreshToken` cookies with `httpOnly`, `SameSite=None`, and `Secure=false`, and also puts both tokens in the JSON body. Browsers drop `SameSite=None` cookies that are not `Secure`, so the frontend will not rely on those API cookies. The Next.js BFF reads the tokens on the server and sets its own `httpOnly`, `SameSite=Lax` cookies. Scripts on the page never see the JWT.

There is no refresh-token revocation list. Logout clears the browser cookies. A token that was copied from a JSON response stays valid until it expires, which is why the BFF must not forward tokens to the client.

Protected screens live under `/consumer`, `/provider`, `/operator`, `/admin`, and `/my-payments`. Hiding a link is not authorization.

Frontend environment variables are `API_URL` (server only), `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, and `NEXT_PUBLIC_DEMO_LOGIN`. Database URLs, JWT secrets, SMTP passwords, and `BKASH_*` stay on the API.

## Payment

The running payment provider is **bKash Tokenized Checkout**.

Older assignment drafts in `../files/` and the unused `../prisma-schema.prisma` mention SSLCommerz, and some of those drafts also mention Stripe as an alternative. Those drafts were not what the server implemented. The server README, video guide, Postman collection, `.env.example`, and `../power-mesh-server/src/app/lib/bkash.ts` all use bKash. The frontend will follow the server.

The consumer starts payment with `POST /api/v1/payments/initiate`. The UI navigates to `bkashURL`. bKash returns the browser to the API callback, which executes the payment and redirects to `{FRONTEND_URL}/my-payments?status=success|cancel|failure`. The page must confirm status with the payments API. Currency is BDT. There is no inbound webhook route.

## Project structure

```text
power-mesh-client/                 # this repository
├── AGENTS.md                      # rules for coding agents
├── README.md                      # this file
└── docs/
    ├── FRONTEND_PLAN.md           # canonical frontend architecture
    ├── FRONTEND_TASKS.md          # task tracker
    └── FRONTEND_DECISIONS.md      # architecture decisions

../power-mesh-server/              # sibling Express API
├── src/modules/                   # auth, users, providers, events, offers, requests,
│                                  # reservations, payments, delivery, admin
└── prisma/schema/                 # live PostgreSQL schema
```

Older assignment drafts live beside this repo in `../files/` and `../prisma-schema.prisma`. They are not authoritative.

The Next.js app is not scaffolded yet. Phase 0 adds it at the root of this repository. Do not create a nested `frontend/` package.

## Local development

Backend prerequisites: Node.js 20+, PostgreSQL, Redis, and credentials for bKash sandbox, Google OAuth, and SMTP if you exercise those flows. From the sibling server repo, copy `.env.example` to `.env` and replace the placeholders. Do not commit `.env`.

```bash
cd ../power-mesh-server
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

When `NODE_ENV=development`, the server seeds demo users. The example API port is `5000`. Set `FRONTEND_URL=http://localhost:3000` so CORS and the bKash return URL match the Next.js app. Set `BKASH_CALLBACK_URL` to the API callback, for example `http://localhost:5000/api/v1/payments/callback`.

When Phase 0 lands in this repository, the app uses placeholders like:

```bash
API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
NEXT_PUBLIC_DEMO_LOGIN=true
```

`NEXT_PUBLIC_GOOGLE_CLIENT_ID` must be the same public client id the API expects. The client secret stays on the API.

## Demo accounts

These are development seed accounts from `../power-mesh-server/.env.example`, the server README, and `VIDEO_GUIDE.md`. They are created when seeding runs. They are not production credentials.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@powermesh.com` | `Admin@123` |
| Operator | `operator@powermesh.com` | `Operator@123` |
| Provider | `provider@powermesh.com` | `Provider@123` |
| Consumer | `consumer@powermesh.com` | `Consumer@123` |

The seeded provider can log in and still cannot create an offer until an operator or admin approves them. The seed sets `verified: true` and leaves provider status at the schema default `PENDING_EMAIL_VERIFICATION`. Offer creation requires `APPROVED`.

## Development workflow

Work is task-driven. Pick one item in [`docs/FRONTEND_TASKS.md`](docs/FRONTEND_TASKS.md), implement only that item, then update its status.

Coding agents follow [`AGENTS.md`](AGENTS.md): read the plan and decisions, inspect the backend route they are calling, and stop when a task is blocked by a missing API. Architecture changes are written into [`docs/FRONTEND_DECISIONS.md`](docs/FRONTEND_DECISIONS.md) and the plan before the code drifts.

The frontend history should contain at least 20 meaningful commits (foundation, auth, each role, payment, delivery, admin, hardening, deployment). Do not add empty commits to hit that count, and do not squash those milestones unless someone explicitly asks.

## Current status

| Area | Status |
| --- | --- |
| Express API, schema, bKash, seeds, Postman | Implemented in the sibling `power-mesh-server` repo |
| Frontend architecture and task tracker | Written in this repository under `docs/` |
| Next.js UI, BFF, dashboards, payment screens | Not started |
| Frontend deployment | Not deployed |

No frontend task is `IN_PROGRESS`.

## Known limitations

- API auth cookies use `SameSite=None` and `Secure=false`, so browsers reject them. Tokens are also in the JSON body. The planned BFF exists because of that.
- Logout does not revoke refresh tokens. Cookie clearing does not match the original `SameSite` and `Secure` options.
- Auth middleware blocks `BLOCKED` users and does not block `DELETED` users. Role is read from the JWT, not from the user row.
- `GET /api/v1/auth/me` is the wrong profile endpoint for provider and operator shells.
- Provider list paging is not applied.
- `GET /api/v1/reservation/:id` does not check ownership. Payment detail scopes consumers and does not scope providers. Prefer the owned list endpoints in the UI.
- Cancelling a request does not free the unique `(consumer, event)` pair, so a second request returns a conflict.
- Allocation preview does not save anything. Approval is a separate call.
- `survivalQuotaKw` is stored and not used by allocation.
- Partial-delivery refunds are local rows. The payment status does not change, and bKash is not called.
- `EMAIL_FAIL_OPEN` defaults to returning the OTP in the API response when mail fails. Do not log that value.
- No password reset, ratings API, incident API, zones, or standing offers.

## Deployment

The API is what the server video guide deploys. The frontend has no host yet. The intended shape is a separate Next.js deployment whose public origin is `FRONTEND_URL` on the API, with bKash still calling the API callback. Do not treat the frontend as deployed.

## Documentation

- [`AGENTS.md`](AGENTS.md) — rules for anyone (including coding agents) changing the frontend
- [`docs/FRONTEND_PLAN.md`](docs/FRONTEND_PLAN.md) — architecture, API map, security, payment, folder layout
- [`docs/FRONTEND_TASKS.md`](docs/FRONTEND_TASKS.md) — phased task tracker
- [`docs/FRONTEND_DECISIONS.md`](docs/FRONTEND_DECISIONS.md) — architecture decision records
- [`../power-mesh-server/README.md`](../power-mesh-server/README.md) — backend setup, roles, and endpoint index
- [`../power-mesh-server/API_TEST_FLOW.md`](../power-mesh-server/API_TEST_FLOW.md) — request walkthrough
- [`../power-mesh-server/PowerMesh-Server.postman_collection.json`](../power-mesh-server/PowerMesh-Server.postman_collection.json) — Postman collection
