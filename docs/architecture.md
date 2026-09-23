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
