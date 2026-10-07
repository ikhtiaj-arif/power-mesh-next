# Deployment checklist for PowerMesh (Next.js static export + Express API)

Mirrors **Healthcare-Client**: `output: "export"`, `npm run build` writes `out/`, `npm start` serves it with `npx serve@latest out`.

Templates:

- Local: [`.env.example`](../.env.example) (client) and `power-mesh-server/.env.example`
- Production: [`.env.production.example`](../.env.production.example) and `power-mesh-server/.env.production.example`

## 1. Origins must agree

| App | Variable | Example |
| --- | --- | --- |
| Next | `NEXT_PUBLIC_APP_URL` | `https://app.example.com` |
| Next | `NEXT_PUBLIC_API_BASE_URL` | `https://api.example.com/api/v1` (absolute) |
| Next | `API_URL` | `https://api.example.com` (build-time ISR only) |
| Express | `FRONTEND_URL` | `https://app.example.com` (same as Next public URL) |
| Express | `BKASH_CALLBACK_URL` | `https://api.example.com/api/v1/payments/callback` |

The browser calls Express **directly** — there is no Next `/api` BFF in the static `out/` folder. Relative `/api/v1` will 404 under `serve`.

## 2. Shared ISR token

| App | Variable |
| --- | --- |
| Next | `ISR_SERVICE_TOKEN` |
| Express | `ISR_SERVICE_TOKEN` |

Same long random string on both. Required at **Next build time** for provider detail prerender. Restart Express after changing it.

## 3. Production safety

- `NEXT_PUBLIC_DEMO_LOGIN=false` on Next
- `NODE_ENV=production` on Express
- `EMAIL_FAIL_OPEN=false` once mail works
- Strong unique `JWT_*` and `ISR_SERVICE_TOKEN`
- `RUN_SEEDS=false` unless the demo host intentionally needs seed accounts

## 4. Cookies + CORS

Express sets `httpOnly` auth cookies. With a separate static origin, configure CORS `FRONTEND_URL` to the static site origin and ensure cookie `SameSite`/`Secure` match HTTPS production.

## 5. Build + run (local prod static)

```bash
# API
cd power-mesh-server && npm run dev

# Client — bake env, then serve out/
cd power-mesh-client
npm run build
npm start
```

Open `http://localhost:3000`. API must be on `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:5000/api/v1`).

## 6. Google OAuth

Authorized JavaScript origins and redirect URIs in GCP must include `NEXT_PUBLIC_APP_URL` / `FRONTEND_URL`.
