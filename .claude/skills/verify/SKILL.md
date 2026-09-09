---
name: verify
description: Sanity-check frontend and backend changes before considering a task done — runs frontend lint and backend build, since this repo has no test suite to lean on.
---

Run, in order, and report pass/fail for each:

1. `yarn lint` in `frontend/` (if frontend files changed)
2. `./gradlew build` in `backend/` (if backend files changed; on Windows use `gradlew.bat build`)

Do not run `./gradlew test` as part of this — `RecurApplicationTests` is currently broken due to a package-placement issue unrelated to most changes (see CLAUDE.md). If a task specifically touches test setup, mention this known issue rather than treating a test failure as caused by the current change.

Report which commands ran and any lint/build errors found. Surface errors for review rather than silently fixing them, unless the task explicitly asked for a clean fix.
