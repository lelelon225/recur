# AGENT_TASK.md — React (Vite) → Next.js App Router migration

This document plans the migration of `frontend/` from React 19 + Vite 8 +
react-router-dom 7 to **Next.js 16 (App Router)**, in place, on the current
branch `feat/frontend/migrate-next.js`. It is written to be executed by a
separate subagent per task, one task at a time, in the wave order below.
Each task is self-contained — read only the "Context" it lists, don't assume
you have this document's authors' conversation.

## Ground rules for every task

- **Client-only migration.** Axios, React Context, Formik, and the
  `localStorage`-JWT auth flow are not being rewritten. The app must behave
  identically after migration — same requests, same storage, same redirects.
  No Server Components fetch data, no cookies are introduced.
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
Wave 1:  T1 (alone)
Wave 2:  T2 (alone)
Wave 3:  T3 + T4 + T5 (parallel, disjoint files)
Wave 4:  T6 (alone) -> T7 (after T6)
```

---

## T1 — Scaffold Next.js build config

**Goal:** Replace the Vite toolchain with Next.js 16 config. After this task
the app will not build yet (no `app/` directory exists) — that's expected;
T1 only proves the *config* is sound.

**Context:** `frontend/` is a Vite 8 + React 19 app. Its dev proxy forwards
`/api`, `/oauth2`, `/login/oauth2` to the Spring backend at
`http://localhost:8080`, deliberately *not* proxying `/login` itself (that's
the SPA's own login route). The backend's REST API lives under `/api`
(`TaskController` is `@RequestMapping("/api/task")`, `AuthController` is
`/api/auth`). Tailwind is v4, CSS-first (no `tailwind.config.*` file exists).
`components.json` (shadcn) has `"rsc": false` — keep it that way.

**Files to create:**
- `frontend/next.config.ts`
- `frontend/postcss.config.mjs`

**Files to modify:**
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/eslint.config.js`
- `frontend/.env`
- `frontend/.env.example`
- `frontend/.gitignore`

**Files to delete:**
- `frontend/vite.config.ts`
- `frontend/index.html`
- `frontend/tsconfig.app.json`
- `frontend/tsconfig.node.json`
- `frontend/src/vite-env.d.ts`
- `frontend/package-lock.json` (stale — yarn.lock is the real lockfile)

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Equivalent of vite.config.ts server.allowedHosts — lets `yarn dev`
  // be reached through an ngrok tunnel in dev.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.app"],

  async rewrites() {
    const backend = "http://localhost:8080";
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      { source: "/oauth2/:path*", destination: `${backend}/oauth2/:path*` },
      // Only the OAuth2 callback path under /login, not /login itself —
      // /login is our own route (LoginPage). This rule is a strictly
      // longer/more specific match than any bare "/login" route, so it
      // does not intercept the SPA's login page.
      {
        source: "/login/oauth2/:path*",
        destination: `${backend}/login/oauth2/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

Note for the implementer: `next dev`'s rewrite proxy may not forward
`X-Forwarded-Proto/Host/Port` the same way the old Vite proxy's custom
`configure` hook did (see `vite.config.ts` git history / the German comments
if the file still exists at HEAD~). This is a **named risk for T6**, not
something to solve here — T1 only needs the plain rewrite rules above.

### `postcss.config.mjs`

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

`src/globals.css` is untouched — its `@import "tailwindcss"` etc. keep working
under the PostCS plugin.

### `package.json`

Dependency changes:
- Add: `"next": "^16.3.4"`, `"@tailwindcss/postcss": "^4.3.2"`
- Remove: `"vite"`, `"@vitejs/plugin-react"`, `"@tailwindcss/vite"`,
  `"react-router-dom"`, `"eslint-plugin-react-refresh"`
- Keep everything else as-is (axios, formik, yup, date-fns, @base-ui/react,
  lucide-react, react-day-picker, react-error-boundary, next-themes, sonner,
  class-variance-authority, clsx, tailwind-merge, tw-animate-css,
  @fontsource-variable/geist, tailwindcss, shadcn, typescript,
  typescript-eslint, eslint, eslint-plugin-react-hooks, @eslint/js, globals,
  @types/*).
  - `@emotion/react` / `@emotion/styled` are unused (zero import sites in
    `src/`) — leave them for T7 to remove, don't touch here.

Scripts:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "typecheck": "tsc --noEmit",
  "lint": "eslint ."
}
```
(Drop `preview`. The old `build` was `tsc -b && vite build`; `next build`
does its own type checking during the build, and `typecheck` is added as a
separate fast-fail script for CI/local use.)

### `tsconfig.json`

Collapse the current three-file project-reference setup
(`tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`) into one file,
since Next wants a single tsconfig and generates `next-env.d.ts` itself:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "jsx": "preserve",
    "verbatimModuleSyntax": false,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "incremental": true,
    "strict": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Two changes from the old `tsconfig.app.json` worth calling out explicitly so
the next agent doesn't "fix" them back:
- `jsx` becomes `"preserve"` (was `"react-jsx"`) — Next's compiler handles the
  JSX transform itself.
- `verbatimModuleSyntax` is turned **off** here. The old value (`true`) forces
  `import type` everywhere, which is fine, but Next's generated
  `.next/types/**/*.ts` files are not written with that in mind and can
  conflict. If `yarn typecheck` is clean with it left `true`, it's fine to
  restore — verify, don't assume.
- Drop `types: ["vite/client"]` and `allowImportingTsExtensions` (Vite-only).

### `eslint.config.js`

Remove the `reactRefresh.configs.vite` preset (Vite-specific — not applicable
under Next's own Fast Refresh) and its import line. Change the ignored build
directory:

```js
import js from 'eslint/js' // unchanged import style — see below
```

Concretely, apply this diff to the existing file:
```diff
 import js from '@eslint/js'
 import globals from 'globals'
 import reactHooks from 'eslint-plugin-react-hooks'
-import reactRefresh from 'eslint-plugin-react-refresh'
 import tseslint from 'typescript-eslint'
 import { defineConfig, globalIgnores } from 'eslint/config'

 export default defineConfig([
-  globalIgnores(['dist']),
+  globalIgnores(['.next', 'out', 'next-env.d.ts']),
   {
     files: ['**/*.{ts,tsx}'],
     extends: [
       js.configs.recommended,
       tseslint.configs.recommended,
       reactHooks.configs.flat.recommended,
-      reactRefresh.configs.vite,
     ],
     languageOptions: {
       globals: globals.browser,
     },
   },
 ])
```
Do **not** switch to `eslint-config-next` — this repo runs eslint 10 (a very
new major), and `eslint-config-next`'s own peer-dependency range is a real
compatibility risk not worth taking mid-migration. Note this decision in your
task report so a human can revisit it later if they want Next's lint rules
(e.g. `next/no-img-element`).

### `.env` / `.env.example`

```diff
-VITE_API_URL=/api
+NEXT_PUBLIC_API_URL=/api
```
and in `.env.example`:
```diff
-VITE_API_URL=url
+NEXT_PUBLIC_API_URL=url
```
(T2/T3 will update the one call site, `src/services/api.ts`, to read
`process.env.NEXT_PUBLIC_API_URL`. Don't touch `src/services/api.ts` in this
task — that's out of scope for T1.)

### `.gitignore`

Add Next's build output (keep every existing line):
```diff
 node_modules
 dist
 dist-ssr
 *.local
+
+# Next.js
+.next
+out
+next-env.d.ts
```

**Do not touch:** anything under `frontend/src/`, `components.json`,
`frontend/README.md`.

**Verify:**
```bash
cd frontend
yarn install
yarn build
```
Expect the build to fail with a Next.js error about a missing `app/`
directory (or similar routing-entrypoint error) — that is the correct,
expected failure for this task, since T2 hasn't run yet. A failure about a
broken config option, unresolved dependency, or invalid tsconfig is **not**
expected and means this task isn't done. Also run `yarn lint` — it should
run cleanly against the (unchanged) `src/` files with no new rule
violations.

---

## T2 — Build the App Router tree

**Goal:** Replace `src/main.tsx` + `src/App.tsx` (react-router SPA
entrypoint) with the Next.js `app/` directory: layouts, providers, and one
`page.tsx` per route. This task does **not** fix the react-router imports
inside `src/components/`, `src/hooks/`, `src/contexts/` — those still import
`react-router-dom` after this task and the build stays red. That's expected;
T3/T4 fix them in the next wave.

**Depends on:** T1 (needs `next.config.ts` etc. in place; does not need T1's
build to pass).

**Context — current entrypoint** (`frontend/src/main.tsx`, full file):
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { TasksProvider } from './contexts/TasksContext'
import ReactErrorBoundary from './components/error/ReactErrorBoundary.tsx'
import { TooltipProvider } from './components/ui/tooltip'
import { SidebarProvider } from './components/ui/sidebar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactErrorBoundary>
      <AuthProvider>
          <TooltipProvider>
            <SidebarProvider>
              <TasksProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
              </TasksProvider>
            </SidebarProvider>
          </TooltipProvider>
      </AuthProvider>
    </ReactErrorBoundary>
  </StrictMode>
)
```

**Context — current routes** (`frontend/src/App.tsx`, full file, 135 lines):
read it yourself before starting — it defines 10 routes: `/login`,
`/register`, `/oauth/success`, `/auth/error` (all public, no layout), and
`/`, `/favorites`, `/archive`, `/calendar`, `/setting/account` (all wrapped
identically in `ProtectedRoute > DefaultLayout(pageTitle="...") >
ReactErrorBoundary`), plus a catch-all `/*` → `ErrorPage` 404. It also
defines a small inline component `OAuthErrorPage` (lines 17-30) that reads
`?message` via `useSearchParams` and renders `ErrorPage` with `errorCode=401`.

`ReactErrorBoundary` (`src/components/error/ReactErrorBoundary.tsx`) wraps
`react-error-boundary`'s `<ErrorBoundary>` — **keep using this component**.
It is not being replaced by Next's `error.tsx` convention: `TasksContext`
calls `useErrorBoundary()` from the same library and depends on an ancestor
`<ErrorBoundary>` existing in the React tree, which Next's file-convention
error boundaries do not provide.

### Files to create

**`frontend/src/app/layout.tsx`** (Server Component — no `"use client"`):
```tsx
import type { Metadata } from "next";
import "@/globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "RECUR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```
(`lang="de"` — the old `index.html` had `lang="en"` but the app's UI text is
German throughout; use `de` here. If you'd rather preserve the exact old
value, use `"en"` instead and note the discrepancy in your report — either
is acceptable, just be consistent.)

**`frontend/src/app/providers.tsx`** (`"use client"` — this is the *only*
client boundary needed at the root; everything it wraps inherits client-ness
through the import graph):
```tsx
"use client";

import type { ReactNode } from "react";
import ReactErrorBoundary from "@/components/error/ReactErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TasksProvider } from "@/contexts/TasksContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <SidebarProvider>
            <TasksProvider>{children}</TasksProvider>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </ReactErrorBoundary>
  );
}
```
This is the provider order from `main.tsx` verbatim, minus `StrictMode`
(replaced by `reactStrictMode: true` in `next.config.ts` from T1) and minus
`BrowserRouter` (there is no router provider under App Router). Yes, this
means `SidebarProvider` ends up mounted here **and again** inside
`DefaultLayout` (T4 territory) — that duplication exists in the app today
(`main.tsx:17` + `DefaulLayout.tsx:37`) and is intentionally preserved, not
fixed, to keep this migration behavior-neutral. It's listed in the appendix
below for a future cleanup.

**`frontend/src/app/not-found.tsx`** (`"use client"` — needs `useRouter`):
```tsx
"use client";

import { useRouter } from "next/navigation";
import ErrorPage from "@/components/pages/ErrorPage";

export default function NotFound() {
  const router = useRouter();
  return (
    <ErrorPage
      errorCode={404}
      errorMessage="Seite nicht gefunden"
      buttonText="Zurück zur Startseite"
      resetErrorBoundary={() => router.push("/")}
    />
  );
}
```
This replaces the old `<Route path="/*" element={<ErrorPage .../>} />`.

**`frontend/src/components/pages/OAuthErrorPage.tsx`** (new file — lifts the
inline component out of `App.tsx:17-30` so it can be a normal client
component under a route):
```tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ErrorPage from "@/components/pages/ErrorPage";

export default function OAuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <ErrorPage
      errorCode={401}
      errorMessage={searchParams.get("message") ?? "Google-Login fehlgeschlagen."}
      buttonText="Zurück zum Login"
      resetErrorBoundary={() => router.push("/login")}
    />
  );
}
```
Note `useSearchParams()` (from `next/navigation`) is **not** a tuple like
react-router's — it returns the `ReadonlyURLSearchParams` object directly.

**`frontend/src/app/(public)/login/page.tsx`**:
```tsx
import LoginPage from "@/components/pages/LoginPage";

export default function Page() {
  return <LoginPage />;
}
```

**`frontend/src/app/(public)/register/page.tsx`**:
```tsx
import SignupPage from "@/components/pages/SignupPage";

export default function Page() {
  return <SignupPage />;
}
```

**`frontend/src/app/(public)/oauth/success/page.tsx`** (Server Component
wrapping the client page in `Suspense` — required because the page tree
uses `useSearchParams()`, which forces a client-side render boundary and
requires `Suspense` around it under `next build`'s static analysis):
```tsx
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import OAuthCallbackPage from "@/components/pages/OAuthCallbackPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <OAuthCallbackPage />
    </Suspense>
  );
}
```

**`frontend/src/app/(public)/auth/error/page.tsx`** (same reasoning — wraps
the new `OAuthErrorPage`):
```tsx
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import OAuthErrorPage from "@/components/pages/OAuthErrorPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <OAuthErrorPage />
    </Suspense>
  );
}
```

**`frontend/src/app/(app)/layout.tsx`** (`"use client"` — replaces the
`ProtectedRoute > DefaultLayout(pageTitle) > ReactErrorBoundary` triple that
`App.tsx` repeated 5 times, one per protected route):
```tsx
"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DefaultLayout from "@/components/templates/DefaulLayout";
import ReactErrorBoundary from "@/components/error/ReactErrorBoundary";

const ROUTE_META: Record<string, { title: string; errorMessage: string }> = {
  "/": {
    title: "Deine Habits",
    errorMessage: "Deine Habits konnten nicht angezeigt werden.",
  },
  "/favorites": {
    title: "Deine Favoriten",
    errorMessage: "Deine Favoriten konnten nicht angezeigt werden.",
  },
  "/archive": {
    title: "Dein Archiv",
    errorMessage: "Dein Archiv konnte nicht angezeigt werden.",
  },
  "/calendar": {
    title: "Dein Kalender",
    errorMessage: "Dein Kalender konnte nicht angezeigt werden.",
  },
  "/setting/account": {
    title: "Account",
    errorMessage: "Dein Account konnte nicht angezeigt werden.",
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const meta = ROUTE_META[pathname] ?? { title: "", errorMessage: "" };

  return (
    <ProtectedRoute>
      <DefaultLayout pageTitle={meta.title}>
        <ReactErrorBoundary errorMessage={meta.errorMessage} fullScreen={false}>
          {children}
        </ReactErrorBoundary>
      </DefaultLayout>
    </ProtectedRoute>
  );
}
```
This file imports `ProtectedRoute` and `DefaultLayout`, which still contain
react-router imports at this point in the migration — that's fine, T2 only
builds the routing tree; T3/T4 fix those files' internals next wave. Your
build will still fail after T2; only report *which* errors remain (they
should all trace to `react-router-dom` imports inside
`src/components/`/`src/hooks/`/`src/contexts/`, not to anything in
`src/app/`).

**`frontend/src/app/(app)/page.tsx`**:
```tsx
import HomePage from "@/components/pages/HomePage";

export default function Page() {
  return <HomePage />;
}
```

**`frontend/src/app/(app)/favorites/page.tsx`**:
```tsx
import FavoritesPage from "@/components/pages/FavoritesPage";

export default function Page() {
  return <FavoritesPage />;
}
```

**`frontend/src/app/(app)/archive/page.tsx`**:
```tsx
import ArchivePage from "@/components/pages/ArchivePage";

export default function Page() {
  return <ArchivePage />;
}
```

**`frontend/src/app/(app)/calendar/page.tsx`** (the default export of
`CalendarPage.tsx` is confusingly named `CalendarGrid` — import it as such):
```tsx
import CalendarGrid from "@/components/pages/CalendarPage";

export default function Page() {
  return <CalendarGrid />;
}
```

**`frontend/src/app/(app)/setting/account/page.tsx`**:
```tsx
import AccountPage from "@/components/pages/AccountPage";

export default function Page() {
  return <AccountPage />;
}
```

### Files to delete
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`

### Do not touch
- Anything under `frontend/src/components/` **except** the one new file
  `src/components/pages/OAuthErrorPage.tsx`.
- Anything under `frontend/src/hooks/`, `frontend/src/contexts/`,
  `frontend/src/services/`.
- `frontend/next.config.ts`, `frontend/package.json` (T1's territory).

**Verify:**
```bash
cd frontend
yarn build 2>&1 | tail -50
```
Confirm every reported error is a `react-router-dom` module-not-found (or a
type error inside a file that imports it) inside `src/components/`,
`src/hooks/`, or `src/contexts/` — not inside `src/app/`. Also manually
diff your new `src/app/` tree against the table in this task to confirm
nothing was missed:
```bash
find frontend/src/app -type f | sort
```
should list exactly the files this task created (11 files:
`layout.tsx`, `providers.tsx`, `not-found.tsx`, `(public)/login/page.tsx`,
`(public)/register/page.tsx`, `(public)/oauth/success/page.tsx`,
`(public)/auth/error/page.tsx`, `(app)/layout.tsx`, `(app)/page.tsx`,
`(app)/favorites/page.tsx`, `(app)/archive/page.tsx`,
`(app)/calendar/page.tsx`, `(app)/setting/account/page.tsx` — that's 13,
recount when you're done).

---

## T3 — Port `src/hooks/` off react-router

**Goal:** Replace every `react-router-dom` import in `src/hooks/` with the
`next/navigation` equivalent, preserving exact behavior.

**Depends on:** T2 (the routes it navigates to must exist).
**Runs in parallel with:** T4, T5 — disjoint files, safe to run together.

**Context — the mapping every file in this task follows:**

| react-router-dom | next/navigation | Note |
|---|---|---|
| `const navigate = useNavigate()` then `navigate(path)` | `const router = useRouter()` then `router.push(path)` | |
| `navigate(path, { replace: true })` | `router.replace(path)` | |
| `navigate(-1)` | `router.back()` | |
| `useLocation().pathname` | `usePathname()` | returns the string directly |
| `const [searchParams] = useSearchParams()` | `const searchParams = useSearchParams()` | **not a tuple** — drop the array destructure |

### Files to modify

**`frontend/src/hooks/useLoginForm.ts`** — replace
`import { useNavigate } from "react-router-dom"` with
`import { useRouter } from "next/navigation"`; `const navigate = useNavigate()`
→ `const router = useRouter()`; the call site `navigate("/", { replace: true })`
→ `router.replace("/")`.

**`frontend/src/hooks/useSignUpForm.ts`** — same pattern: import swap,
`navigate("/", { replace: true })` → `router.replace("/")`.

**`frontend/src/hooks/useOAuthCallback.ts`** — full current file:
```ts
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type OAuthCallbackStatus = "loading" | "error";

export function useOAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { completeOAuthLogin } = useAuth();

    const [status, setStatus] = useState<OAuthCallbackStatus>("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setErrorMessage("Kein Token in der Antwort von Google erhalten.");
            return;
        }

        completeOAuthLogin(token)
            .then(() => navigate("/", { replace: true }))
            .catch((err) => {
                setStatus("error");
                setErrorMessage(err instanceof Error ? err.message : "Google-Login fehlgeschlagen.");
            });
    }, [searchParams, completeOAuthLogin, navigate]);

    return { status, errorMessage };
}
```
Rewrite to:
```ts
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type OAuthCallbackStatus = "loading" | "error";

export function useOAuthCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { completeOAuthLogin } = useAuth();

    const [status, setStatus] = useState<OAuthCallbackStatus>("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setErrorMessage("Kein Token in der Antwort von Google erhalten.");
            return;
        }

        completeOAuthLogin(token)
            .then(() => router.replace("/"))
            .catch((err) => {
                setStatus("error");
                setErrorMessage(err instanceof Error ? err.message : "Google-Login fehlgeschlagen.");
            });
    }, [searchParams, completeOAuthLogin, router]);

    return { status, errorMessage };
}
```
This hook is only ever used inside the `Suspense`-wrapped
`(public)/oauth/success/page.tsx` from T2, so `useSearchParams()` here is
safe.

**`frontend/src/hooks/useNavigationBar.ts`** — full current file:
```ts
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export type NavigationDestination = {
  path: string;
  navigate: () => void;
  label: string;
  icon: LucideIcon;
};

export function useNavigationBar(destinations: NavigationDestination[]) {
  const location = useLocation();

  const activeValue = useMemo(() => {
    const match = destinations.find((d) => d.path === location.pathname);
    return match?.path ?? destinations[0]?.path ?? "";
  }, [destinations, location.pathname]);

  const handleNavigation = useCallback(
    (path: string) => {
      destinations.find((d) => d.path === path)?.navigate();
    },
    [destinations],
  );

  return { activeValue, handleNavigation };
}
```
Replace `useLocation` with `usePathname`:
```ts
import { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export type NavigationDestination = {
  path: string;
  navigate: () => void;
  label: string;
  icon: LucideIcon;
};

export function useNavigationBar(destinations: NavigationDestination[]) {
  const pathname = usePathname();

  const activeValue = useMemo(() => {
    const match = destinations.find((d) => d.path === pathname);
    return match?.path ?? destinations[0]?.path ?? "";
  }, [destinations, pathname]);

  const handleNavigation = useCallback(
    (path: string) => {
      destinations.find((d) => d.path === path)?.navigate();
    },
    [destinations],
  );

  return { activeValue, handleNavigation };
}
```
Note: `organisms/NavigationBar.tsx` (the only consumer of this hook) has no
importers anywhere in the codebase currently — it's dead code. Leave it as
is; don't delete it as part of this task (out of scope — see appendix).

**Do not touch:** `frontend/src/components/`, `frontend/src/contexts/`,
`frontend/src/services/`, `backend/`, `start-dev.ps1` (T4/T5's territory).

**Verify:**
```bash
cd frontend
grep -rn "react-router" src/hooks/   # must return nothing
yarn typecheck
```
`yarn build` will still fail (T4 hasn't run) — only `src/hooks/` needs to be
clean of react-router-dom.

---

## T4 — Port `src/components/` off react-router

**Goal:** Replace every `react-router-dom` import in `src/components/` with
`next/navigation`, and fix one real (non-router) bug found in exploration.

**Depends on:** T2.
**Runs in parallel with:** T3, T5 — disjoint files.

**Context:** Same mapping table as T3 above — reuse it.

### Files to modify

**`frontend/src/components/auth/ProtectedRoute.tsx`** — full current file:
```tsx
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
```
`next/navigation` has no `<Navigate>` component — redirecting during render
isn't supported the same way. Rewrite using an effect:
```tsx
"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

type ProtectedRouteProps = {
  children: ReactNode;
};

/**
 * Wraps a route that requires authentication.
 * - While the initial auth check is running, shows a loading state
 *   (prevents a flash of the login page for already-logged-in users).
 * - If not authenticated, redirects to /login and remembers where the
 *   user was trying to go via a ?from= query param, so a future login
 *   flow could send them back after login (currently unread — see
 *   AGENT_TASK.md appendix).
 * - Otherwise renders the protected content.
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
```
Note this file needs its own `"use client"` — it's imported by
`(app)/layout.tsx` (already client) but is also a reasonable independent
boundary. Since it's always used under an already-client ancestor, the
directive is optional but harmless; add it for clarity per file, consistent
with how T2 marked its boundaries.

**`frontend/src/components/pages/LoginPage.tsx`** — swap
`useNavigate`/`navigate("/register")` → `useRouter()`/`router.push("/register")`.
Read the file first; only the import and the one navigation call site
change.

**`frontend/src/components/pages/SignupPage.tsx`** — same pattern,
`navigate("/login")` → `router.push("/login")`.

**`frontend/src/components/pages/OAuthCallbackPage.tsx`** — swap
`useNavigate` → `useRouter`; if it also has a raw `navigate("/login")` call
site (check the file — the hook `useOAuthCallback` from T3 does most of the
navigation, but confirm this page component itself doesn't also import
`react-router-dom` directly), convert it the same way.

**`frontend/src/components/pages/ArchivePage.tsx`** — `useNavigate` →
`useRouter`, `navigate("/")` → `router.push("/")`.

**`frontend/src/components/pages/FavoritesPage.tsx`** — same,
`navigate("/")` → `router.push("/")`.

**`frontend/src/components/pages/AccountPage.tsx`** — this one uses
`navigate(-1)` (line ~125, inside `AccountPageWrapper`'s `onClose` prop):
```tsx
onClose: () => navigate(-1),
```
becomes:
```tsx
onClose: () => router.back(),
```
with `const router = useRouter()` (from `next/navigation`) replacing
`const navigate = useNavigate()`. Leave the `window.location.reload()` call
in the submit handler's `finally` block untouched — that's an intentional
hard reload, not a router navigation.

**`frontend/src/components/templates/DefaulLayout.tsx`** — full current
file:
```tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { History, Heart, Archive, Calendar } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { AddTaskProvider } from "@/contexts/AddTaskContext";
import { ImportQuartalsplanProvider } from "@/contexts/ImportQuartalsplanContext";
import Fab from "@/components/atoms/FloatingActionButton";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import AppSidebar from "../organisms/AppSidebar";

type DefaultLayoutProps = {
  children: ReactNode;
  pageTitle?: string;
};

const NAV_ROUTES = [
  { path: "/", label: "Neuste", icon: History },
  { path: "/favorites", label: "Favoriten", icon: Heart },
  { path: "/archive", label: "Archiv", icon: Archive },
  { path: "/calendar", label: "Kalender", icon: Calendar },
] as const;

function DefaultLayout({ children, pageTitle }: DefaultLayoutProps) {
  const navigate = useNavigate();

  const destinations = NAV_ROUTES.map(({ path, label, icon: Icon }) => ({
    path,
    navigate: () => navigate(path),
    label,
    icon: Icon,
  }));

  return (
    <AddTaskProvider>
      <ImportQuartalsplanProvider>
        <SidebarProvider>
          <AppSidebar destinations={destinations} />

          <SidebarInset>
            <div className="flex mx-auto w-full max-w-6xl px-4 py-6 pb-24">
              <div className="mb-6 flex w-full flex-col gap-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />

                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />

                  <h1 className="text-xl font-semibold text-foreground">
                    {pageTitle}
                  </h1>
                </div>

                <main>{children}</main>
              </div>
            </div>

            <Toaster position="bottom-left" />
            <Fab className="fixed bottom-4 right-4" />
          </SidebarInset>
        </SidebarProvider>
      </ImportQuartalsplanProvider>
    </AddTaskProvider>
  );
}

export default DefaultLayout;
```
Only the router import and hook change — everything else (including the
duplicate `SidebarProvider`) is preserved as-is:
```diff
 import type { ReactNode } from "react";
-import { useNavigate } from "react-router-dom";
+import { useRouter } from "next/navigation";
 import { History, Heart, Archive, Calendar } from "lucide-react";
 ...
 function DefaultLayout({ children, pageTitle }: DefaultLayoutProps) {
-  const navigate = useNavigate();
+  const router = useRouter();

   const destinations = NAV_ROUTES.map(({ path, label, icon: Icon }) => ({
     path,
-    navigate: () => navigate(path),
+    navigate: () => router.push(path),
     label,
     icon: Icon,
   }));
```
Do not rename the filename (`DefaulLayout.tsx`, missing a "t") or fix the
duplicate-`SidebarProvider` issue here — both are pre-existing and listed in
the appendix for a separate cleanup pass, not this migration.

**`frontend/src/components/organisms/AppSidebar.tsx`** — two changes:
1. Router: swap `useNavigate`/`navigate(...)` calls (there are two call
   sites — one to `/setting/account`, one to `/`) to `useRouter()`/
   `router.push(...)`.
2. **Real bug fix** (not router-related): line ~12 currently imports
   ```ts
   import SidebarNavigation from "@/components/molecules/SideBarNavigation";
   ```
   but the file on disk is `SidebarNavigation.tsx` (lowercase `b`). This
   resolves today only because macOS's filesystem is case-insensitive; it
   will break the build on Linux CI or any case-sensitive filesystem
   (including most Docker images). Fix the import to match the actual
   filename:
   ```ts
   import SidebarNavigation from "@/components/molecules/SidebarNavigation";
   ```

**Do not touch:** `frontend/src/hooks/` (T3's territory),
`frontend/src/contexts/`, `frontend/src/services/`, `backend/`,
`start-dev.ps1` (T5's territory), `frontend/src/app/` (T2 already wrote it —
don't re-touch it here unless you find a genuine mistake, in which case
report it rather than silently changing it).

**Verify:**
```bash
cd frontend
grep -rln "react-router" src/components/   # must return nothing
yarn typecheck
```

---

## T5 — Align ports (backend CORS + dev launch script)

**Goal:** Next's dev server runs on port **3000**, not Vite's 5173. Update
the two places outside `frontend/` that hardcode 5173.

**Depends on:** none — can run any time in Wave 3 (or earlier, it's
independent of the frontend rewrite itself). Listed in Wave 3 for
convenience since it's small and disjoint from T3/T4.

### Files to modify

**`backend/src/main/resources/application.properties`** — line ~17:
```diff
-app.cors.allowed-origin=${CORS_ALLOWED_ORIGIN:http://localhost:5173,https://unmoved-giant-factual.ngrok-free.dev}
+app.cors.allowed-origin=${CORS_ALLOWED_ORIGIN:http://localhost:3000,https://unmoved-giant-factual.ngrok-free.dev}
```
Change only the port number in the default value. Leave the ngrok URL and
the `CORS_ALLOWED_ORIGIN` env var name untouched.

**`start-dev.ps1`** (repo root) — it currently polls and opens
`http://localhost:5173`. Update every occurrence of `5173` to `3000` (there
are two: the polling `Invoke-WebRequest -Uri "http://localhost:5173"` check,
and the final `Start-Process "http://localhost:5173"`). Leave the backend
port (`8080`) and everything else in the script untouched — it's a Windows
PowerShell script; don't rewrite its structure, just the port literals.

**Do not touch:** anything under `frontend/`, any other backend file,
`docker-compose.yml` (it has no frontend service today and this task
doesn't add one).

**Verify:**
```bash
grep -n "5173" backend/src/main/resources/application.properties start-dev.ps1
```
should return nothing. Confirm no other `5173` reference exists in tracked
files outside `frontend/`:
```bash
git grep -n "5173" -- ':!frontend'
```
should also return nothing after your edit (it's fine — expected — for this
to still find hits *inside* `frontend/` if T1 hasn't fully landed yet; this
task doesn't touch `frontend/`).

---

## T6 — Green build + OAuth2 end-to-end verification

**Goal:** Confirm `yarn lint`, `yarn typecheck`, and `yarn build` are all
clean, then manually verify the running app, including the Google OAuth2
flow, which is the migration's highest-risk piece.

**Depends on:** T3, T4, T5 all complete.

### Step 1 — static verification
```bash
cd frontend
yarn install
yarn lint
yarn typecheck
yarn build
```
All three must exit 0. If `yarn build` fails, read the error, find the file,
and fix it — by this point every remaining error should be a normal
TypeScript/React issue, not a structural router problem (T2-T4 already
handled those). Common things to check if something's still red:
- A file under `src/components/` or `src/hooks/` still imports
  `react-router-dom` (T3/T4 missed it — `grep -rln "react-router" src/`
  across the whole tree, not just the folders those tasks covered, since a
  file might exist that wasn't in their explicit lists).
- A component using `useSearchParams()` outside a `Suspense` boundary —
  Next's build will name the exact route; wrap it the way T2's
  `(public)/oauth/success` and `(public)/auth/error` pages do.

### Step 2 — manual smoke test
Start the backend and frontend:
```bash
cd backend && ./gradlew bootRun &
cd frontend && yarn dev
```
Open `http://localhost:3000` and walk through, in order:
1. `/login` renders (not the SPA's default light-flash — dark mode not
   relevant here, just confirm the page renders).
2. Log in with an existing test account (email/password). Confirm redirect
   to `/`.
3. Visit `/favorites`, `/archive`, `/calendar`, `/setting/account` via the
   sidebar — confirm each renders its correct German title
   ("Deine Favoriten", "Dein Archiv", "Dein Kalender", "Account") and no
   console errors.
4. Toggle dark mode (sidebar) — confirm it applies.
5. Press Cmd/Ctrl+B — confirm the sidebar collapses (this exercises
   `ui/sidebar.tsx`'s keydown listener, unaffected by the migration but
   worth confirming it still works under Next's dev server).
6. Add a task, edit it, archive it, delete it from Archive — confirms
   `TasksContext`'s optimistic-update + `useErrorBoundary()` path still
   works under the new provider tree.
7. Log out (sidebar user popover) — confirm hard redirect to `/login`.
8. **Google OAuth2 flow** — click "Mit Google anmelden" on `/login`, confirm
   the redirect to Google, and after authorizing, confirm you land back on
   `/oauth/success?token=...` and then get redirected to `/`.

### Step 3 — the named risk: OAuth2 redirect_uri_mismatch

**Why this might break:** the old `vite.config.ts` proxy had a custom
`configure` hook that explicitly rewrote `x-forwarded-proto`,
`x-forwarded-host`, and `x-forwarded-port` on every proxied request, because
Spring's `ForwardedHeaderFilter` (enabled via
`server.forward-headers-strategy=framework`) uses those headers to build the
OAuth2 `redirect_uri` it hands to Google — and `OAuth2AuthenticationSuccessHandler`
similarly builds its own post-login redirect via
`ServletUriComponentsBuilder.fromContextPath(request)`. If Next's rewrite
proxy (`next.config.ts` from T1) does not forward these headers the same
way, Spring may build the wrong scheme/host/port and either the initial
Google authorize request gets a `redirect_uri_mismatch`, or the final
success-handler redirect lands on the wrong origin.

**Verified against Next's own proxy source** (`packages/next/src/server/lib/router-utils/proxy-request.ts`,
Next 16.3.x): the internal `rewrites()` proxy does **not** set `xfwd`, and it
sets `x-forwarded-host` by *overwrite* (not append), while `x-forwarded-proto`
and `x-forwarded-port` pass through from the original client request
untouched. That means the exact `"https,http"` comma-append failure the old
Vite `configure` hook worked around does **not** reproduce here — Next's
proxy is well-behaved by default, and the elaborate Vite hack is not needed
in `next.config.ts`. This substantially lowers the risk: expect the plain
`rewrites()` from T1 to work unmodified for local dev and through ngrok
(ngrok already sets `X-Forwarded-Proto: https` and preserves `Host`; Next's
overwrite of `x-forwarded-host` with that same value is a no-op). Two things
still worth checking explicitly in step 2.8: don't run ngrok with
`--host-header=rewrite` (it would replace `Host` with `localhost:3000` and
break the forwarded chain), and confirm in DevTools → Network that the
`redirect_uri` query param on the `accounts.google.com` request reads
`http://localhost:3000/login/oauth2/code/google` (or the https ngrok
equivalent) — never `:8080`, never port-less. Treat the fallback below as a
low-probability contingency, not the expected path.

**If step 2.8 fails with `redirect_uri_mismatch` or a broken redirect**,
replace the `/oauth2` and `/login/oauth2` `rewrites()` entries from T1 with
a proxy handler that sets the headers explicitly. In Next 16 this file is
`src/proxy.ts`; **verify the correct convention for the installed Next
version first** (`yarn next --version`, then check
`node_modules/next/dist/server/...` or the Next changelog — the middleware
convention was renamed between major versions; don't guess).

Sketch (port the port-extraction logic straight from the old
`vite.config.ts`, adapting to Next's `NextRequest`/`NextResponse` API):
```ts
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsBackend =
    pathname.startsWith("/oauth2") || pathname.startsWith("/login/oauth2");
  if (!needsBackend) return NextResponse.next();

  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "http";
  const forwardedHost =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const hostParts = forwardedHost.split(":");
  const forwardedPort =
    hostParts.length > 1 ? hostParts[1] : forwardedProto === "https" ? "443" : "80";

  const url = new URL(pathname + request.nextUrl.search, "http://localhost:8080");
  const headers = new Headers(request.headers);
  headers.set("x-forwarded-proto", forwardedProto);
  headers.set("x-forwarded-host", forwardedHost);
  headers.set("x-forwarded-port", forwardedPort);

  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/oauth2/:path*", "/login/oauth2/:path*"],
};
```
Keep the plain `rewrites()` entry for `/api/:path*` in `next.config.ts` — it
carries no OAuth2 header sensitivity, no need to move it into the proxy
handler. Remove the now-redundant `/oauth2`/`/login/oauth2` entries from
`next.config.ts`'s `rewrites()` once the proxy handler covers them (having
both would double-rewrite).

If you have to add this proxy handler, re-run step 2.8 to confirm it fixes
the flow, and note in your report that T1's `next.config.ts` was amended.

**Do not touch:** `backend/` beyond what's needed to run it locally for
testing (no code changes there — T5 already made the one required change).

**Verify:** all of Step 1's three commands exit 0, and Step 2's 8-point
walkthrough completes with no console errors and no failed network requests
(check the browser devtools Network tab, especially around step 8).

---

## T7 — Cleanup and docs

**Goal:** Small trailing cleanups now that the app is green, plus updating
docs that reference the old Vite setup.

**Depends on:** T6 complete and verified.

### Files to modify

**`CLAUDE.md`** (repo root) — the "Commands" section's frontend block
currently says:
```
Frontend (`frontend/`, package manager is **yarn** — a stale `package-lock.json` also exists, ignore it):
- `yarn dev` — start dev server (port 5173)
- `yarn build` — `tsc -b && vite build`
- `yarn lint` — ESLint (flat config, no Prettier configured)
- No test script or test framework exists in the frontend.
```
Update to reflect Next.js (port 3000, `next build`, note the stale
`package-lock.json` was deleted in T1 so remove that caveat too):
```
Frontend (`frontend/`, package manager is **yarn**):
- `yarn dev` — start dev server (port 3000)
- `yarn build` — `next build`
- `yarn typecheck` — `tsc --noEmit`
- `yarn lint` — ESLint (flat config, no Prettier configured)
- No test script or test framework exists in the frontend.
```
Also update the "Architecture" section's Frontend paragraph: it currently
opens with "Frontend follows atomic design under `src/components/`..." —
that stays true, but add a short note that routing now lives in
`src/app/` (Next.js App Router) rather than `src/App.tsx` +
react-router-dom, and that route components under `src/components/pages/`
are still where page logic lives (only thin `page.tsx` files in `src/app/`
import them). Keep the rest of that section (`@/` alias, Context state,
Formik+Yup, colocated domain types, axios instance) as-is — none of that
changed.

Also check the "Project" line at the top (`Frontend: React + TypeScript +
Vite (`frontend/`)`) and update it to say Next.js instead of Vite.

**`frontend/README.md`** — if it references `vite`, port 5173, or
`index.html`, update those references the same way. Read it first; if it's
just the default Vite template README, replace it with a short paragraph
describing the Next.js App Router structure instead (mention `yarn dev`,
port 3000, and the `src/app/` + `src/components/` split).

**`frontend/package.json`** — remove the now-confirmed-unused dependencies:
```diff
- "@emotion/react": "^11.14.0",
- "@emotion/styled": "^11.14.1",
```
Confirm zero import sites first:
```bash
grep -rn "@emotion" frontend/src
```
must return nothing before removing.

### Files to delete
- `frontend/src/components/molecules/TaskDetailModal.tsx` — a 0-byte file
  with no importers anywhere in the codebase. Confirm before deleting:
  ```bash
  wc -c frontend/src/components/molecules/TaskDetailModal.tsx   # expect 0
  grep -rln "TaskDetailModal" frontend/src                       # expect only this file itself
  ```

**Do not touch:** anything else. This task is intentionally small — do not
use it as an opportunity to fix the other items in the appendix below; they
are explicitly out of scope for this migration.

**Verify:**
```bash
cd frontend
yarn install
yarn build
```
must still be clean after removing the emotion deps and the dead file.
```bash
git diff --stat
```
review that the diff only touches the files listed above.

---

## Appendix — pre-existing issues found during exploration, NOT fixed by this migration

These are real, but each is either unrelated to the Next.js migration or
risky enough to deserve its own reviewed change. Do not fix them as part of
any task above unless that task explicitly says to.

- `src/components/molecules/DetailDialog.tsx:6` has a bogus
  `import children from "react";` (unused default import).
- `SidebarProvider` is mounted twice in the tree (`src/app/providers.tsx`
  after this migration, and again inside `DefaultLayout.tsx`) — preserved
  from the original `main.tsx` + `DefaulLayout.tsx` duplication.
- `src/components/organisms/NavigationBar.tsx` and
  `src/components/molecules/AppBar.tsx` have no importers anywhere —
  dead code.
- On the `SidebarProvider` duplication noted above: a grep confirms nothing
  outside `DefaultLayout.tsx` consumes the *root*-mounted instance
  (`src/app/providers.tsx` after T2), so a follow-up could drop it from
  `providers.tsx` entirely rather than keep both — a small simplification,
  not a behavior fix, left for whoever picks up this appendix.
- `src/services/taskService.ts`'s `Task` interface has no `isArchived`
  field, though `TasksContext` filters on `t.isArchived` — likely a type
  gap, not a runtime bug (the backend does return the field).
- `src/components/templates/DefaulLayout.tsx` has a filename typo (missing
  a "t"), imported as `DefaultLayout` — cosmetic, would require touching
  every import site.
- `taskService.ts`'s `patchTask` destructures `durationMinutes`/`startTime`
  out of its options type but never forwards them as request params.
- The JWT currently travels in the browser's URL query string at
  `/oauth/success?token=...` — works, but is visible in browser history and
  server logs. A cleaner design would have the backend set an httpOnly
  cookie instead; that's a bigger, deliberately-out-of-scope change (this
  migration is client-only-first, per the decision at the top of this
  document).
- `useDarkMode` (`src/hooks/useDarkMode.ts`) sets its initial state via a
  `useEffect`, causing a brief light-mode flash on load before the stored/
  preferred theme applies. A blocking inline `<script>` in
  `src/app/layout.tsx` (reading `localStorage`/`matchMedia` and setting the
  `dark` class before hydration, paired with `suppressHydrationWarning` on
  `<html>`) would fix this and is a natural next step now that
  `next-themes` is already a dependency — but it changes both the load
  sequence and would ideally replace the hand-rolled hook with
  `next-themes` proper. Left for a follow-up.
- `OAuth2AuthenticationSuccessHandler.java` builds its redirect from
  `ServletUriComponentsBuilder.fromContextPath(request)`, which is why the
  X-Forwarded-* header dance in T6 exists at all. A more robust long-term
  fix is giving the backend an explicit configured frontend base URL
  (`app.frontend.base-url` or similar) instead of deriving it from
  possibly-untrusted forwarded headers — out of scope here since it's a
  backend security-relevant change, not a frontend framework migration.
