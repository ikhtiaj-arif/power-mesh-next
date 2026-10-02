# PowerMesh — Agent Working Rules

PowerMesh is a load-shedding and backup-power marketplace. Consumers request backup kilowatts during an outage event, providers offer capacity, and operators schedule events and run allocation. Admins manage users, audit history, and platform stats.

This repository is the frontend. It is built against the existing Express API in the sibling repository `../power-mesh-server/`. That live implementation (`../power-mesh-server/src`, `../power-mesh-server/prisma/schema`) is the source of truth when any document disagrees with the code. Useful companions, when they match the code, are `../power-mesh-server/README.md`, `API_TEST_FLOW.md`, `VIDEO_GUIDE.md`, `PowerMesh-mvp.html`, and the Postman collection.

These lose on conflict:

- `../files/` (sprint plan, checklist, starter kit, quick reference, mermaid ERD)
- `../prisma-schema.prisma`
- any note that says the payment provider is SSLCommerz or Stripe
- any note that collapses `ADMIN` and `OPERATOR` into one role

Read `docs/FRONTEND_DECISIONS.md` ADR-010 before changing that rule.

## Workflow for every implementation task

1. Read this file.
2. Read the relevant sections of `docs/FRONTEND_PLAN.md`.
3. Read `docs/FRONTEND_TASKS.md` and select one task.
4. Read the related entries in `docs/FRONTEND_DECISIONS.md`.
5. Inspect the existing frontend code and the backend route, service, and Zod schema the task calls.
6. Identify the exact task id. Implement only that task.
7. Validate the result against that task's acceptance criteria.
8. Update the task status in `docs/FRONTEND_TASKS.md`.
9. If the work changed an architectural fact, update `docs/FRONTEND_PLAN.md`, add or revise a decision in `docs/FRONTEND_DECISIONS.md`, and update `README.md` when the change is user-facing.
10. Review the final diff. Remove unrelated edits.
11. Create one meaningful Git commit for that task.

Do not start the next task in the same turn unless the user asked for a batch.

Do not silently change architecture, scope, role boundaries, payment provider, or the BFF session model. A better idea becomes a proposed decision, recorded after it is accepted, not a drive-by rewrite.

### When the backend cannot support the task

- Do not fake success, mock a live gateway, or hide a missing field behind placeholder data that looks real.
- Do not add a client-only permission the API will reject.
- Set the task status to `BLOCKED`.
- Write the required backend change in the task's backend-dependency notes and in `docs/FRONTEND_PLAN.md` under conflicts and gaps.
- Record an architectural decision only when the team chooses a different frontend behavior because of the limitation.

Allowed statuses in `docs/FRONTEND_TASKS.md`: `TODO`, `IN_PROGRESS`, `BLOCKED`, `REVIEW`, `DONE`.

## Architecture rules

These are the current decisions. Deviate only when the live API makes the rule wrong, and document the deviation in `docs/FRONTEND_DECISIONS.md`.

- Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui. Mobile-first, accessible UI.
- Server Components are the default. A component is a Client Component only when it needs interactivity, browser APIs, React state, TanStack Query, Zustand, React Hook Form, a file input, or the bKash redirect.
- React Hook Form and Zod for forms. Keep Zod rules aligned with the mounted backend body schemas (consumer names are 3–10 characters; provider names are 3–50; password requires 8+ characters with lower, upper, digit, and symbol; OTP is 6 digits). TanStack Form is not part of the current decision.
- TanStack Query owns API and server state. Zustand stores genuine client-global UI state only (sidebar collapsed). Do not copy query results, JWTs, OTPs, or payment payloads into Zustand.
- URL search params hold list filters and pagination (`page`, `limit`, `status`, `searchTerm`, `eventId`) and the payment return hint.
- Authentication uses a same-origin Next.js BFF. The browser receives first-party `httpOnly` cookies. JavaScript never stores access or refresh tokens in `localStorage`, `sessionStorage`, or Zustand.
- The backend remains the authorization authority. Next.js middleware only redirects for navigation. A forced URL must still fail with 401 or 403 from Express.
- Role homes stay separate: `/consumer`, `/provider`, `/operator`, `/admin`. `ADMIN` cannot create or update outage events. `OPERATOR` cannot manage users, audit logs, or dashboard stats.
- The payment UI integrates bKash Tokenized Checkout only. The return route is exactly `/my-payments`. The query `status` is a hint. Show success only after `GET /api/v1/payments/my-payments` or `GET /api/v1/payments/:id`.
- Session profile comes from `GET /api/v1/users/me`, which includes consumer, provider, and operator profiles. `GET /api/v1/auth/me` includes only the consumer profile.
- Organize by feature under `features/`, with shared UI in `components/`. The Next.js app lives at the root of this repository, not in a nested `frontend/` folder. Do not add a second `services/` layer beside `lib/api` and the BFF routes.
- Prefer the simplest component that meets the task. Do not add chart platforms, websocket clients, virtualized tables, or a multi-gateway payment abstraction until a task needs them.
- Performance: respect the API rate limits (200 requests / 15 min globally, 30 / 15 min on auth, provider, and payments). One `['me']` query per shell. Debounce search. `refetchOnWindowFocus` stays off except payment return and in-progress delivery.
- Accessibility: labeled controls, keyboard focus, text for status that is not color alone, and readable API errors (`message` and `errors` rendered as text).

## Git

The frontend needs at least 20 meaningful commits across its history. Do not create empty, formatting-only, or split-the-same-file commits to reach that number.

Each commit should be a real milestone, for example:

- foundation and BFF session
- authentication and demo login
- role shells
- consumer requests and reservations
- provider offers
- operator events and allocation
- bKash payment return
- delivery
- admin users and audit
- hardening
- deployment

Do not squash that history unless the user explicitly says to squash.

Commit only the files for the task, in this repository. Do not commit `../power-mesh-server/.env` or any secret. Do not change backend code, Prisma schema, or the server git history as part of a frontend task unless the user explicitly asks for a backend change.

Frontend commits belong in this repository. The Express app already has its own git history under `../power-mesh-server/`.

## Documentation sync

If implementation changes architecture:

1. Update `docs/FRONTEND_PLAN.md`.
2. Add or update the decision in `docs/FRONTEND_DECISIONS.md`.
3. Update affected tasks in `docs/FRONTEND_TASKS.md`.
4. Update `README.md` when the change affects the human-facing overview.
5. Then continue.

`README.md` stays a concise overview. The plan stays the technical source for agents.

## Out of scope until a backend exists

Password reset, OTP resend, ratings, incident management, service zones, standing offers, SSLCommerz, Stripe, gateway execution of partial-delivery refunds, and refresh-token revocation. Those tasks are `BLOCKED` in `docs/FRONTEND_TASKS.md`. Do not invent the UI as if the routes exist.
