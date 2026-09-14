# AGENT_TASK.md — React (Vite) → Next.js App Router migration

This document plans the migration of `frontend/` from React 19 + Vite 8 +
react-router-dom 7 to **Next.js 16 (App Router)**, in place, on branch
`feat/frontend/migrate-next.js`. It is written to be executed by a separate
subagent per task, one task at a time. Each task is self-contained — read
only the "Context" it lists, don't assume you have this document's authors'
conversation.

**Status as of 2026-09-14: T1–T9 are done, and T10's low-risk frontend
items are done too** (dark-mode flash, `next/font`, `next/image` audit,
spinner centering). The one T10 item genuinely out of scope for this
migration — a middleware-based auth guard requiring a JWT-storage/security
change — was deliberately left undone; see T10 below for why. Everything
is committed on this branch, `yarn lint`/`yarn typecheck`/`yarn build` are
all green, and the Docker image was built and run locally against the real
backend.

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
Waves 1–7 (T1–T10): DONE. See "Done" below and T10's own status note.
```

---

## Done (T1–T9) — summary, not a task to run again

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
  `/api`, `/oauth2`, `/login/oauth2` was confirmed sufficient for local dev
  (Next's dev proxy passes `x-forwarded-proto`/`-port` through untouched and
  overwrites `x-forwarded-host` with the same value ngrok/localhost would
  set). Group-related contexts/services (`GroupsContext`, `groupService.ts`)
  and a Quartalsplan import feature were added on this branch after T1–T6
  landed — they are already Next-native (written directly against
  `src/app/`, no react-router legacy to strip).
- **T7 — cleanup and docs.** `CLAUDE.md` (Project/Commands/Architecture/
  Environment sections) and `frontend/README.md` updated off the old Vite
  references (port 5173, `vite build`, `VITE_API_URL`). `@emotion/react` /
  `@emotion/styled` removed from `package.json` (zero import sites).
- **T8 — SSR-safety audit.** Every file touching `window`/`document`/
  `localStorage`/`sessionStorage` was checked. Two real render-body accesses
  fixed: `GroupDetailPage.tsx` computed the invite link's
  `window.location.origin` directly during render (now an effect + state,
  starts empty, fills in after mount); `sonner.tsx`'s `useAppTheme` read
  `document.documentElement.classList` in a `useState` lazy initializer (now
  guarded with `typeof document !== "undefined"`). Everything else was
  already effect/handler-scoped. `use-mobile.ts` was also rewritten using
  `useSyncExternalStore` (done as part of T7/T8's lint-fix pass — see below).
- **Lint-fix pass** (between T6 and T7, not its own numbered task): `yarn
  lint` had 8 pre-existing errors unrelated to the migration itself
  (build/typecheck were already clean), surfaced only once dependencies were
  freshly installed. Fixed: a real Rules-of-Hooks violation in
  `AddTaskForm.tsx` (a hook called inside Formik's render-prop callback,
  extracted into a proper child component); `use-mobile.ts` rewritten with
  `useSyncExternalStore`; `useOAuthCallback.ts`'s error state now computed
  synchronously instead of via effect; `eslint.config.js` tuned
  (`ignoreRestSiblings` for the unused-vars rule, AppleDouble `._*` shadow
  files ignored — this repo lives on an exFAT drive). Three call sites
  (`TasksContext.tsx`, `GroupsContext.tsx`, `useDarkMode.ts`) got a targeted
  `eslint-disable` with a justifying comment rather than a restructure, since
  they're legitimate "reset on external auth change" / "read browser state
  after mount" patterns on root-level singleton providers with no
  per-instance key to remount — restructuring them risked behavior
  regressions in core data-loading contexts for no real gain.
- **T9 — Docker & deployment.** `frontend/Dockerfile` rewritten as a
  Next.js `output: "standalone"` multi-stage build (`node:20-alpine` build +
  run stages, no more nginx). `frontend/nginx.conf` and
  `nginx.conf.template` deleted — fully redundant once Next's own server
  handles both serving and proxying. `frontend/.dockerignore` added (didn't
  exist before — `COPY . .` was copying `node_modules`/`.next`/`.git` into
  every build).
  **Important correction to the original plan below:** `next.config.ts`'s
  `rewrites()` is resolved once at `next build` time and its destination is
  frozen into `.next/routes-manifest.json` — a `BACKEND_URL` env var read
  there **never** sees the value passed at `docker run` time, only whatever
  was present when the image was built. Discovered by actually building and
  running the image locally against the real backend (first attempt failed
  with `ECONNREFUSED ::1:8080` despite `-e BACKEND_URL=...`). Fixed by
  moving all three proxy rules (`/api`, `/oauth2`, `/login/oauth2`) out of
  `next.config.ts` into `src/proxy.ts` (Next 16's renamed `middleware.ts`
  convention — confirmed via `PROXY_FILENAME` in the installed
  `next` package, not guessed), which runs as real server code on every
  request and reads `process.env.BACKEND_URL` fresh each time. Verified
  end-to-end: built the image, ran it with `BACKEND_URL=http://host.docker.
  internal:8080` against the locally running backend (`/api/task` → 401, not
  500), then re-ran the *same* image with a bogus `BACKEND_URL` and got a
  connection failure — proving the target is genuinely runtime-configurable,
  not baked in.
  **Not done, flagged for whoever deploys this:** the external
  `/opt/recur/compose.yml` (homelab, not in this repo) still expects the
  frontend container on port 80 with a `BACKEND_HOST` build/template
  variable — it needs updating to port **3000** and a `BACKEND_URL` run-time
  env var (a full URL, not just a hostname) before this can actually ship.

**First thing whoever picks up T10 should do:** re-run the static checks
fresh, since this status summary is a point-in-time read of the repo, not a
guarantee the tree is still green:
```bash
cd frontend
yarn install
yarn lint
yarn typecheck
yarn build
```

---

## T10 — Optional idiomatic-Next follow-ups

**Status as of 2026-09-14: the low-risk frontend-only items are done.** The
one item that was a real backend/security-architecture change — the
middleware-based auth guard — was deliberately **not** done; see below.

- **Done — dark-mode flash fixed.** A blocking inline `<script>` was added
  to the `<head>` in `src/app/layout.tsx` that reads `localStorage`/
  `matchMedia` and sets the `dark` class on `<html>` before hydration,
  paired with `suppressHydrationWarning` on `<html>`. `useDarkMode.ts` no
  longer has an initializing `useEffect` at all — it just reads the class
  the script already set via a `useState` lazy initializer, which also
  removed the `eslint-disable` comment that hook needed before (there's no
  longer a setState-in-effect to suppress).
- **Done — `next/font` instead of `@fontsource-variable/geist`.** Next 16
  ships "Geist" directly via `next/font/google` (confirmed in
  `next/dist/compiled/@next/font/dist/google/font-data.json`, not assumed).
  `src/app/layout.tsx` now loads it with `variable: "--font-geist-sans"`
  and applies `geistSans.variable` as a class on `<html>`;
  `globals.css`'s `--font-sans` now points at `var(--font-geist-sans)`
  instead of the literal `'Geist Variable'` string. The
  `@fontsource-variable/geist` CSS `@import` and package dependency are
  both gone.
- **Done — `next/image` audited.** Zero raw `<img>` tags exist anywhere in
  `src/` — every avatar goes through the shadcn `ui/avatar.tsx` primitive.
  Nothing to migrate; there was nothing found, not nothing done.
- **Done — all loading spinners centered.** Every full-page loading state
  used `flex min-h-screen items-center justify-center` except
  `JoinGroupPage.tsx`'s (`flex justify-center py-12` — horizontal-only, no
  `min-h-screen`), which now matches the same pattern as its siblings
  (`CalendarPage.tsx`, `AccountPage.tsx`, `ProtectedRoute.tsx`,
  `OAuthCallbackPage.tsx`). `LoadingTime.tsx`'s spinner is unrelated (an
  inline label+spinner combo, not a full-page state) and unused anywhere in
  the app — left alone.
- **Side effect found and fixed while testing this:** Next 16's dev server
  auto-generates `AGENTS.md`/`CLAUDE.md` in `frontend/` on first `yarn dev`
  (a new "agent rules" feature) — collided with this repo's own
  hand-maintained root `CLAUDE.md` and would've shown up as untracked-file
  noise in every session. Disabled via `agentRules: false` in
  `next.config.ts`; the two generated files were deleted (never committed).
- **Not done, deliberately: middleware-based auth guard.** Replacing the
  client-side `ProtectedRoute` (effect-based redirect, causes a
  loading-spinner flash on every protected page) with auth logic in
  `src/proxy.ts` would require moving the JWT out of `localStorage` into a
  cookie the proxy can read at request time — a real backend + security
  architecture change (CSRF considerations, `SameSite` cookie policy, the
  backend needs to actually set the cookie), not a pure frontend refactor.
  Explicitly deferred — if picked up later, treat it as its own feature and
  run it through `grill-mich` first per this repo's CLAUDE.md convention
  rather than improvising the design here.
- **Not done, deliberately: `eslint-config-next` adoption.** Still deferred
  from T1 over the eslint 10 peer-dependency risk — nothing changed here to
  revisit that.
- **Not done: Server Components for genuinely static parts of pages.** Rare
  in this app (most of it is interactive/context-driven) and not concretely
  scoped — left as a vague future idea, not something actionable right now.

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
