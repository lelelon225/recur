# Architecture

An overview of how Recur is put together, for contributors who don't want to
reverse-engineer it from the code. (Agent-facing conventions — commands,
known issues, style rules — live in `CLAUDE.md`; this doc is about how the
system fits together.)

## Overview

Three pieces, run independently: a Spring Boot API, a Next.js frontend, and
Postgres. The frontend never talks to Postgres directly — everything goes
through the API. See the root [`README.md`](../README.md) for how to run
them locally.

```
frontend (Next.js, :3000)  --/api, /oauth2, /login/oauth2-->  backend (Spring Boot, :8080)  -->  Postgres (:5436)
```

## Backend

Package convention:
`ch.noseryoung.domain.recur.{controllers,services,repositories,models,enums,dto,security,exceptions,utils}`.
Layers do what their names say — controllers accept requests and delegate,
services hold business logic, repositories are Spring Data JPA interfaces.

**Auth** is hybrid, both paths sharing one `SecurityFilterChain`
(`SecurityConfig`):

- Stateless JWT (`jjwt`) for normal API calls, checked by
  `JwtAuthenticationFilter` on every request.
- Spring Security OAuth2/OIDC for "Sign in with Google".

Whichever path a request came in on, all `Task`/`Project`/`TaskGroup`
queries are scoped to the owner resolved from `SecurityContextHolder` — there
is no cross-user query path in the service layer.

Schema is managed by Hibernate (`ddl-auto=update`); there is no
Flyway/Liquibase migration tooling.

## Frontend

Routing lives in `src/app/` (Next.js App Router — folder structure is the
URL structure). Those `page.tsx` files are thin wrappers only; the actual
page logic lives in `src/components/pages/`, which follows atomic design:

```
src/components/
├── atoms/       small, single-purpose building blocks
├── molecules/   a few atoms composed together
├── organisms/   larger self-contained sections
├── templates/   page-level layout, no real data
├── pages/       actual page implementations (what page.tsx renders)
├── ui/          shadcn primitives
├── auth/
└── error/
```

State is plain React Context (`AuthContext`, `TasksContext`,
`GroupsContext`, `AddTaskContext`) — no Redux/Zustand. Forms use Formik +
Yup. All API calls go through the shared axios instance in
`src/services/api.ts`; domain types (`Task`, `TaskCategory`, ...) live
colocated in `src/services/taskService.ts`, not under `types/`.

## Where things go

One placement rule per folder, for new code. Known existing deviations are
called out as such rather than silently ignored.

### Frontend (`frontend/src/`)

| Folder | What belongs there |
| --- | --- |
| `types/` | Standalone type declarations with no logic that don't belong to a specific service (`auth.ts`, `notifications.ts`, `privacy.ts`). |
| `services/` | Axios calls against the backend API, plus that area's domain types/DTOs/enums (e.g. `Task`, `TaskCategory` in `taskService.ts`) — **known deviation**: domain types intentionally sit next to their service instead of in `types/`, tracked in #191. |
| `hooks/` | Reusable React hooks with state/effect logic shared by more than one component. |
| `schemas/` | Formik + Yup validation schemas for forms. |
| `constants/` | Static, unchanging values/option lists with no logic (dropdown options, links). |
| `lib/` | Thin wrappers around third-party libraries/UI conventions (shadcn's `cn()`, the toast wrapper, category styling maps). |
| `utils/` | Pure, stateless helper functions with no React or library dependency (date formatting, sorting, parsing). |
| `contexts/` | React Context providers for global client state (auth, tasks, groups, ...) — no Redux/Zustand. |
| `components/atoms/` | Smallest single-purpose UI building blocks with no business logic of their own. |
| `components/molecules/` | A handful of atoms composed into a reusable unit (form fields, dialogs, card building blocks). |
| `components/organisms/` | Larger self-contained sections combining several molecules/atoms, usually the ones that load data. |
| `components/templates/` | Page-level layout/grid only, no real data. |
| `components/pages/` | The actual page implementation rendered by the matching `page.tsx`. |
| `components/ui/` | shadcn/ui primitives — kept as generated, not hand-extended. |

### Backend (`backend/.../domain/recur/`)

| Folder | What belongs there |
| --- | --- |
| `controllers/` | REST endpoints: accept and validate the request, delegate to a service — no business logic. |
| `services/` | Business logic and transaction boundaries. |
| `repositories/` | Spring Data JPA interfaces, no implementation. |
| `models/` | JPA entities. |
| `enums/` | Domain enums shared across multiple models/DTOs. |
| `dto/` | Request/response objects that cross the API boundary — never used directly as an entity. |
| `security/` | Auth/OAuth2/JWT infrastructure (filters, `UserDetails` implementations, OAuth2 handlers). |
| `exceptions/` | Custom exceptions plus their matching error-response types. |
| `utils/` | Stateless static helpers that don't clearly belong to one model/service. |

## Auth flow

1. **Password login**: client posts credentials, backend verifies and
   returns a signed JWT. The client sends it as `Authorization: Bearer
   <token>` on subsequent requests; `JwtAuthenticationFilter` validates it.
2. **Google login**: client hits `/oauth2/authorization/google`, Spring
   Security's OAuth2 client handles the redirect dance with Google, and on
   success the backend's success handler issues the same kind of JWT the
   password flow does — from that point on both paths are indistinguishable
   to the rest of the app.

## Further reading

- [`backend/README.md`](../backend/README.md) — backend setup, env vars,
  scripts.
- [`frontend/README.md`](../frontend/README.md) — frontend setup, structure,
  scripts.
- [`docs/data-requests.md`](data-requests.md) — GDPR data access/deletion
  runbook.
- `CLAUDE.md` — agent-facing conventions, commands, and known issues.
