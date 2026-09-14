# AGENT_TASK.md — React (Vite) → Next.js App Router migration

This document plans the migration of `frontend/` from React 19 + Vite 8 +
react-router-dom 7 to **Next.js 16 (App Router)**, in place, on branch
`feat/frontend/migrate-next.js`. It is written to be executed by a separate
subagent per task, one task at a time. Each task is self-contained — read
only the "Context" it lists, don't assume you have this document's authors'
conversation.

**Status as of 2026-09-14: the core framework swap (T1–T6) is done and
committed on this branch.** `next.config.ts`, `package.json` scripts,
`src/app/` (App Router tree), and all `react-router-dom` call sites in
`src/hooks/` and `src/components/` have already been ported to
`next/navigation`. What's left is *not* "get it building" — it's the work
needed to call the migration actually complete: docs, dependency cleanup,
an SSR-safety pass, and — the significant remaining gap — **the app still
cannot be deployed**, because the Docker image and its reverse-proxy config
were never updated off the old Vite/nginx static-SPA setup, and the one
Next.js proxy rule that does exist hardcodes `localhost:8080`, which only
works when the backend runs on the same host as the frontend dev server.

## Ground rules for every task

- **Client-only migration.** Axios, React Context, Formik, and the
  `localStorage`-JWT auth flow are not being rewritten. The app must behave
  identically after migration — same requests, same storage, same redirects.
  No Server Components fetch data, no cookies are introduced. (T9 is a
  partial, deliberate exception — see its own scope note.)
- Package manager is **yarn**. Run `yarn <script>`, not `npm`.
- Work only inside `frontend/` unless a task explicitly names a `backend/` or
  root file.
- After your task, run its **Verify** step and report the exact output. Do
  not proceed to the next wave's tasks — the orchestrator does that.
- If you discover your task's premise is wrong (a file doesn't exist, a path
  differs), stop and report rather than improvising a workaround that changes
  scope.

## Wave plan

```
Waves 1–3 (T1–T6): DONE — framework swap, routing, OAuth2 flow. See "Done" below.

Wave 4:  T7 + T8 (parallel, disjoint files)
Wave 5:  T9 (alone — touches Dockerfile/nginx/next.config.ts, the files T7/T8 don't touch)
Wave 6:  T10 (optional — only if the user asks for it; not required for "complete")
```

---

## Done (T1–T6) — summary, not a task to run again

Recorded here so nobody re-does it and so the "why" behind current code is
traceable. Do not re-open these unless verification below finds a regression.

- **T1 — build config.** `vite.config.ts`, `index.html`, `tsconfig.app.json`/
  `tsconfig.node.json`, `src/vite-env.d.ts`, `package-lock.json` deleted.
  `next.config.ts` and `postcss.config.mjs` added. `package.json` scripts are
  `next dev` / `next build` / `next start` / `tsc --noEmit` / `eslint .`.
  `tsconfig.json` collapsed to one file. `.env`/`.env.example` use
  `NEXT_PUBLIC_API_URL`. `eslint-config-next` was deliberately **not**
  adopted (eslint 10 peer-dep risk) — still true today, revisit only if
  someone wants Next's lint rules (e.g. `next/no-img-element`).
- **T2 — App Router tree.** `src/main.tsx` + `src/App.tsx` replaced by
  `src/app/{layout,providers,not-found,page}.tsx` plus one `page.tsx` per
  route under `src/app/{archive,auth/error,calendar,favorites,groups,
  groups/[id],groups/join/[code],login,oauth/success,register,setting/account}/`.
  Every route is a client component (`"use client"`) — this is a lift-and-
  shift, not an adoption of Server Components; see T10 if that's ever wanted.
  `ProtectedRoute` (client-side, effect-based redirect) still gates the
  protected routes — no `middleware.ts` exists.
- **T3/T4 — react-router-dom removed.** `grep -rln "react-router" src`
  returns nothing. `useNavigate`→`useRouter`, `useLocation`→`usePathname`,
  `useSearchParams` tuple→object, `<Navigate>`→effect+`router.replace`, all
  ported. `react-router-dom` is not in `package.json`.
- **T5 — ports aligned.** Backend CORS default and `start-dev.ps1` both use
  `3000` (confirm no remaining `5173` outside `frontend/`:
  `git grep -n "5173" -- ':!frontend'` should be empty — it is).
- **T6 — OAuth2 verified.** `next.config.ts`'s plain `rewrites()` proxy for
  `/api`, `/oauth2`, `/login/oauth2` was confirmed sufficient (Next's proxy
  passes `x-forwarded-proto`/`-port` through untouched and overwrites
  `x-forwarded-host` with the same value ngrok/localhost would set) — the
  `src/proxy.ts` fallback described in the original plan was **not** needed
  and does not exist. Group-related contexts/services (`GroupsContext`,
  `groupService.ts`) and a Quartalsplan import feature were added on this
  branch after T1–T6 landed — they are already Next-native (written directly
  against `src/app/`, no react-router legacy to strip).

**First thing whoever picks up T7/T8/T9 should do:** re-run the static
checks fresh, since this status summary is a point-in-time read of the repo,
not a guarantee the tree is still green:
```bash
cd frontend
yarn install
yarn lint
yarn typecheck
yarn build
```
All three must exit 0 before starting T7–T9. If any fails, fix it first and
note in your report that you had to (it means something regressed after T6's
original verification, not that T6 was wrong).

---

## T7 — Cleanup and docs

**Goal:** Remove leftover Vite-era artifacts and bring documentation back in
sync with the code. This was partially started already — the dead
`TaskDetailModal.tsx` (0-byte, no importers) and the bogus
`import children from "react"` in `DetailDialog.tsx` mentioned in an earlier
draft of this doc are **already gone** from the tree; don't look for them.
What's still outstanding is docs and the unused `@emotion` dependency.

**Depends on:** the green-build check above.
**Runs in parallel with:** T8 — disjoint files.

### Files to modify

**`CLAUDE.md`** (repo root) — four separate stale spots, all still Vite-era:

1. The "Project" line: `Backend: Java 25 / Spring Boot 4.0.6 (`backend/`).
   Frontend: React + TypeScript + Vite (`frontend/`).` → change "Vite" to
   "Next.js".
2. The "Commands" section's frontend block currently reads:
   ```
   Frontend (`frontend/`, package manager is **yarn** — a stale `package-lock.json` also exists, ignore it):
   - `yarn dev` — start dev server (port 5173)
   - `yarn build` — `tsc -b && vite build`
   - `yarn lint` — ESLint (flat config, no Prettier configured)
   - No test script or test framework exists in the frontend.
   ```
   Update to:
   ```
   Frontend (`frontend/`, package manager is **yarn**):
   - `yarn dev` — start dev server (port 3000)
   - `yarn build` — `next build`
   - `yarn typecheck` — `tsc --noEmit`
   - `yarn lint` — ESLint (flat config, no Prettier configured)
   - No test script or test framework exists in the frontend.
   ```
   (`package-lock.json` was deleted in T1 — drop that caveat.)
3. The "Architecture" section's Frontend paragraph opens with "Frontend
   follows atomic design under `src/components/`..." — keep that, but add a
   sentence noting routing now lives in `src/app/` (Next.js App Router)
   rather than `src/App.tsx` + react-router-dom, and that route logic still
   lives in `src/components/pages/` — `src/app/**/page.tsx` files are thin
   wrappers that import from there. Keep everything else in that section
   (`@/` alias, Context state, Formik+Yup, colocated domain types, axios
   instance) as-is.
4. The "Environment" section says `frontend `.env` needs `VITE_API_URL`` —
   change to `NEXT_PUBLIC_API_URL`.

**`frontend/README.md`** — currently the untouched default Vite template
README (talks about `@vitejs/plugin-react`, `dist`, HMR via Vite). Replace it
with a short paragraph describing the actual setup: Next.js App Router,
`yarn dev` on port 3000, `src/app/` (routes) + `src/components/` (atomic
design, where page logic actually lives) + `src/contexts/` (state).

**`frontend/package.json`** — remove the now-confirmed-unused dependencies
(verified zero import sites: `grep -rn "@emotion" frontend/src` returns
nothing):
```diff
- "@emotion/react": "^11.14.0",
- "@emotion/styled": "^11.14.1",
```

**Do not touch:** anything else. Don't use this task as an opportunity to
fix appendix items below.

**Verify:**
```bash
cd frontend
yarn install
yarn build
```
must stay clean after removing the emotion deps. Then:
```bash
grep -rn "5173\|vite\|VITE_" ../CLAUDE.md frontend/README.md
```
(case-sensitive is fine here) should return nothing except intentional
prose that isn't actually about the old toolchain (re-read any hit before
assuming it's a leftover).

---

## T8 — SSR-safety audit of direct browser API usage

**Goal:** Every route in `src/app/` is a `"use client"` component, but Next
still **server-renders the initial HTML** for client components before
hydration (that's what makes them fast — it's not the same as the old Vite
SPA, which only ever rendered in the browser). Any code that touches
`window`, `document`, `localStorage`, or `sessionStorage` **outside** a
`useEffect`/event handler — i.e. synchronously during render, or at module
top-level — will throw or silently misbehave during that server pass. This
was never audited as part of T1–T6 because the original plan assumed
"client-only migration" meant "no new risk," which is true for behavior but
not for *where* the existing client code now first executes.

**Depends on:** nothing — independent of T7.
**Runs in parallel with:** T7 — disjoint files.

### Files to check (found via `grep -rln "localStorage\|sessionStorage\|window\.\|document\." src`)

- `src/services/authService.ts`
- `src/components/organisms/AddTaskForm.tsx`
- `src/hooks/useFormCache.ts`
- `src/hooks/useDarkMode.ts`
- `src/components/pages/AccountPage.tsx`
- `src/components/pages/GroupDetailPage.tsx`
- `src/components/atoms/GoogleLoginButton.tsx`
- `src/components/ui/sonner.tsx`
- `src/components/ui/sidebar.tsx`
- `src/hooks/use-mobile.ts`

For each file: confirm every `window`/`document`/`localStorage`/
`sessionStorage` access is either (a) inside a `useEffect`/`useLayoutEffect`
body, (b) inside an event handler (`onClick`, etc.), or (c) guarded by
`typeof window !== "undefined"` before use. If you find an access at
render-body or module top-level scope with none of those guards, fix it by
moving the read into a `useEffect` (initializing state from it there, with a
sensible default for the server-rendered pass) — don't just wrap in
`typeof window` checks if that would change the value used for the first
paint in a way that causes a visible flash; note any such tradeoff in your
report rather than silently picking one.

`useDarkMode.ts` in particular is flagged in the appendix below as already
having a known flash-of-wrong-theme issue — that's a separate, larger
follow-up (T10), not something to fix here; just confirm this task doesn't
make it *worse* (i.e. don't introduce a new SSR mismatch on top of the
existing flash).

**Do not touch:** anything under `src/app/` itself, `src/contexts/`
(unless a flagged file above lives there — none currently do).

**Verify:**
```bash
cd frontend
yarn build
yarn dev &
```
Open every route in a browser with DevTools console open (`/login`, `/`,
`/favorites`, `/archive`, `/calendar`, `/setting/account`, `/groups`,
`/groups/[id]` for an existing group). Confirm **zero** "Hydration failed"
or "Text content does not match" warnings in the console. Report which
files you changed and which you confirmed were already safe.

---

## T9 — Docker & deployment for a Next.js server

**Goal:** Make the frontend container actually deployable. Right now it
isn't: `frontend/Dockerfile` still runs a Vite build and copies a `dist/`
folder that `next build` no longer produces (Next writes `.next/`), into an
nginx image whose `nginx.conf.template` serves static files with a
React-Router SPA fallback (`try_files $uri $uri/ /index.html`) — none of
which applies to a Next.js app, which needs a running Node process to
actually render/serve requests, not a static file server. On top of that,
`next.config.ts`'s `rewrites()` hardcodes `http://localhost:8080` as the
backend target, which only works when frontend and backend run on the same
host (local dev) — inside the deployed Docker Compose topology the backend
is a separate service reached by DNS name (`backend-dev`/`backend-prod`,
per the CI/CD comments in `.github/workflows/deploy.yml` and the
`${BACKEND_HOST}` template var in the current `nginx.conf.template`), so
this would silently proxy to nothing in production.

**Context:** `.github/workflows/deploy.yml` builds `./frontend` as a Docker
image and pushes it to GHCR; a self-hosted runner then does
`docker compose -f /opt/recur/compose.yml up -d frontend-{dev,prod}` — that
compose file lives on the homelab host, **not in this repo**, so it's out of
this task's reach; changing the container's listening port (see below) means
that external compose file also needs updating, which is an operational
step for whoever runs the deploy, not something an agent can do here. No
Cloudflare Pages/Workers usage was found anywhere in the repo (`grep -rli
cloudflare` across tracked files returns nothing) — "self-hosted Cloudflare
deployment" refers to the homelab being reached through a Cloudflare Tunnel
for public exposure, not a static-hosting product. That means there is
**no constraint toward a static export** — a normal Node server in the
container is the right shape, not `next export`/`output: "export"` (which
would also break the `/api` and `/oauth2` rewrites entirely, since those
need a running server).

**Depends on:** nothing structurally, but touches files T7/T8 don't, so it
can run in parallel with either. Listed as its own wave only because it's
the largest single task left.

### Files to modify

**`frontend/next.config.ts`** — make the backend rewrite target
configurable instead of hardcoded, and add `output: "standalone"` (produces
a self-contained `.next/standalone/` server bundle — the standard way to
keep a Next.js production Docker image small, avoiding a full `node_modules`
copy):
```diff
+const nextConfig: NextConfig = {
+  reactStrictMode: true,
+  output: "standalone",
   allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.app"],

   async rewrites() {
-    const backend = "http://localhost:8080";
+    const backend = process.env.BACKEND_URL ?? "http://localhost:8080";
     return [
```
Keep the `localhost:8080` fallback for local dev (`yarn dev` without the env
var set must keep working exactly as before). Note: Next.js reads
`next.config.ts` at server boot, so `process.env.BACKEND_URL` here is read
once when the container starts — that's fine for this use case (the backend
host doesn't change at runtime), but means the env var must be present
*before* `next start` launches, same as any other server-side env var (not
a `NEXT_PUBLIC_*` — this one must stay server-only since it's not something
the browser should ever see or need).

**`frontend/Dockerfile`** — replace entirely with a Next.js standalone
multi-stage build:
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Run
FROM node:20-alpine AS run-stage
WORKDIR /app
ENV NODE_ENV=production
# standalone output already includes a minimal node_modules and a
# server.js entrypoint - no separate `yarn install` needed here.
COPY --from=build-stage /app/.next/standalone ./
COPY --from=build-stage /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```
The old `ENV VITE_API_URL=/api` build arg is gone — the API base is now
`NEXT_PUBLIC_API_URL` from `.env` (baked in at build time, same as before,
just renamed — see T1) and the backend proxy target is `BACKEND_URL`,
supplied to the **run** stage (not the build stage) so one built image can
be reused for dev/prod by passing a different `BACKEND_URL` at
`docker run`/compose time — this is the direct replacement for what
`${BACKEND_HOST}` did in the old `nginx.conf.template`.

### Files to delete

- `frontend/nginx.conf`
- `frontend/nginx.conf.template`

These were only ever there to (a) serve the static SPA build and (b) proxy
`/api`, `/oauth2`, `/login/oauth2` to the backend. Next's own server plus
`next.config.ts`'s `rewrites()` now does both jobs — the nginx layer is
fully redundant, not just outdated.

### Not part of this task (flag in your report, don't act on it)

- The external `/opt/recur/compose.yml` (homelab, not in this repo) maps a
  host port to the frontend container's **port 80** today (nginx's listen
  port) and likely sets `BACKEND_HOST` as a build/run arg for the old
  template substitution. After this task the container listens on **3000**
  and expects `BACKEND_URL` (a full URL, e.g. `http://backend-prod:8080`,
  not just a hostname) as a run-time env var. Whoever deploys this needs to
  update that external compose file accordingly — write this down clearly
  in your final report so it isn't missed silently.
- `.github/workflows/deploy.yml` itself needs no change — it just does
  `docker build ./frontend` and pushes; it's agnostic to what's inside the
  Dockerfile.

**Do not touch:** `.github/workflows/`, `docker-compose.yml` (repo root —
it has no frontend service today and this task doesn't add one; the
frontend container is only defined in the external homelab compose file).

**Verify:**
```bash
cd frontend
docker build -t recur-frontend-test .
docker run --rm -p 3000:3000 -e NEXT_PUBLIC_API_URL=/api -e BACKEND_URL=http://host.docker.internal:8080 recur-frontend-test
```
then in another terminal, with the backend running locally on 8080:
```bash
curl -sI http://localhost:3000/            # expect 200 (or a redirect, not a connection error)
curl -sI http://localhost:3000/api/task    # expect it to reach the backend, not 404 from Next itself
```
Also confirm the image is reasonably sized (`docker images recur-frontend-test` —
standalone output should land well under the old nginx+static-assets image,
not larger).

---

## T10 — Optional idiomatic-Next follow-ups (not required for "complete")

Everything above is what's needed for the migration to be finished and
deployable. This task is explicitly **out of scope unless the user asks for
it** — it converts the current "Next.js running an SPA" shape into something
that uses more of what Next actually offers. Don't start it speculatively;
list it here so it's not lost, and because a couple of items (theme flash,
auth-guard flash) are visible quality issues a user might reasonably want
fixed even without wanting the deeper Server Components rework.

- **Middleware-based auth guard.** Replace/supplement the client-side
  `ProtectedRoute` (effect-based redirect, causes a loading-spinner flash on
  every protected page) with `src/middleware.ts` reading the JWT (would
  require moving the token out of `localStorage` into a cookie middleware
  can read — a real behavior change, not a pure refactor; see the appendix's
  "JWT in URL/localStorage" note, they're related).
- **Fix the dark-mode flash.** `useDarkMode.ts` sets initial theme via
  `useEffect`, so there's a flash of the wrong theme on load. A blocking
  inline `<script>` in `src/app/layout.tsx` (reading `localStorage`/
  `matchMedia` before hydration, paired with `suppressHydrationWarning` on
  `<html>`), or adopting `next-themes` properly (already a dependency, not
  actually wired up as the theme mechanism), would fix this.
- **`next/font`** instead of `@fontsource-variable/geist` — self-hosts and
  preloads the font via Next's own pipeline, avoiding a separate CSS import.
- **`next/image`** for any `<img>` tags currently in `src/components/` — not
  audited as part of this document; would need its own grep+review pass.
- **Server Components for genuinely static parts** of pages (rare in this
  app — most of it is interactive/context-driven) and **`eslint-config-next`**
  adoption (deferred in T1 over an eslint 10 peer-dep concern — revisit once
  that plugin has caught up).

---

## Appendix — pre-existing issues, NOT fixed by this migration

Carried forward from the original plan; still accurate as of 2026-09-14. Do
not fix these as part of any task above unless that task explicitly says to.

- `SidebarProvider` is mounted twice in the tree (`src/app/providers.tsx`
  and again inside `DefaultLayout.tsx`) — preserved from the original
  `main.tsx` + `DefaulLayout.tsx` duplication. A grep confirms nothing
  outside `DefaultLayout.tsx` consumes the root-mounted instance, so a
  follow-up could drop it from `providers.tsx` entirely — a small
  simplification, not a behavior fix.
- `src/components/organisms/NavigationBar.tsx` and
  `src/components/molecules/AppBar.tsx` have no importers anywhere — dead
  code.
- `src/services/taskService.ts`'s `Task` interface has no `isArchived`
  field, though `TasksContext` filters on `t.isArchived` — likely a type
  gap, not a runtime bug (the backend does return the field).
- `src/components/templates/DefaulLayout.tsx` has a filename typo (missing
  a "t"), imported as `DefaultLayout` — cosmetic, would require touching
  every import site.
- `taskService.ts`'s `patchTask` destructures `durationMinutes`/`startTime`
  out of its options type but never forwards them as request params.
- The JWT currently travels in the browser's URL query string at
  `/oauth/success?token=...` and is stored in `localStorage` — works, but is
  visible in browser history/server logs and not accessible to server-side
  code (relevant if T10's middleware-auth item is ever picked up). A
  cleaner design would have the backend set an httpOnly cookie instead;
  that's a bigger, deliberately-out-of-scope change.
- `OAuth2AuthenticationSuccessHandler.java` builds its redirect from
  `ServletUriComponentsBuilder.fromContextPath(request)`, relying on
  forwarded headers being correct (see T6's note on why that turned out to
  be fine with Next's proxy). A more robust long-term fix is giving the
  backend an explicit configured frontend base URL
  (`app.frontend.base-url` or similar) instead of deriving it from
  possibly-untrusted forwarded headers — out of scope here, it's a backend
  security-relevant change, not a frontend framework migration.
