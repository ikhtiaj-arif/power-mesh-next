# Deployment checklist for PowerMesh (Next.js client + Express API)

Use this when configuring host dashboards. Secret **values** stay in the host UI — only names are documented here.

Templates:

- Local: [`.env.example`](../.env.example) (client) and `power-mesh-server/.env.example`
- Production: [`.env.production.example`](../.env.production.example) and `power-mesh-server/.env.production.example`

## 1. Origins must agree

| App | Variable | Example |
| --- | --- | --- |
| Next | `NEXT_PUBLIC_APP_URL` | `https://app.example.com` |
| Next | `API_URL` | `https://api.example.com` |
| Express | `FRONTEND_URL` | `https://app.example.com` (same as Next public URL) |
| Express | `BKASH_CALLBACK_URL` | `https://api.example.com/api/v1/payments/callback` |

Mismatch symptoms: CORS failures, cookies set for the wrong host, bKash return landing on the wrong site.

## 2. Shared ISR token

| App | Variable |
| --- | --- |
| Next | `ISR_SERVICE_TOKEN` |
| Express | `ISR_SERVICE_TOKEN` |

Same long random string on both. Required at **Next build time** for `● /admin/providers/<id>` prerender. Restart Express after changing it.

## 3. Production safety

- `NEXT_PUBLIC_DEMO_LOGIN=false` on Next
- `NODE_ENV=production` on Express
- `EMAIL_FAIL_OPEN=false` once mail works
- Strong unique `JWT_*` and `ISR_SERVICE_TOKEN` (not local `powermesh-isr-dev-token`)
- `RUN_SEEDS=false` unless the demo host intentionally needs seed accounts

## 4. Cookies (Next BFF)

On HTTPS, the BFF sets `httpOnly` session cookies with `Secure` when `NODE_ENV=production`. Confirm after deploy: login works, refresh works, `/my-payments` return works.

## 5. Build order

1. Deploy / migrate Express (`npx prisma migrate deploy`, `npm run build`, `npm start`).
2. Set Next env (including `API_URL` + `ISR_SERVICE_TOKEN`).
3. Ensure the API is reachable from the Next build machine, then `npm run build` / host build.
4. Smoke-test: login as each role, open `/admin/providers`, initiate a sandbox payment if credentials exist.

## 6. Google OAuth

Authorized JavaScript origins and redirect URIs in GCP must include `NEXT_PUBLIC_APP_URL` / `FRONTEND_URL`.
