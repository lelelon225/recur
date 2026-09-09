# design-sync notes — Recur frontend

## Repo shape
- No Storybook, no library build (`package.json` has no `main`/`module`/`exports` — this is a Vite *app*, not a publishable component package). Shape is forced to `package` with a synthesized entry from `src/components` (`cfg.srcDir`).
- `cfg.entry` is set to a deliberately non-existent path (`src/.ds-entry-placeholder.tsx`) purely so `package-build.mjs`'s `--entry` walk-up locates `frontend/package.json` as `PKG_DIR`. Do not create that file.
- 198 components discovered under `src/components/{ui,atoms,molecules,organisms,pages,auth,error}`. `ui/` primitives (shadcn, on `@base-ui/react`, not Radix) group as `general` since `ui` is a generic dir name.
- Styling: Tailwind v4 (`@tailwindcss/vite`), JIT-compiled — the raw `src/globals.css` is just `@import` statements with no generated utility classes. `cfg.cssEntry` points at `.design-sync/.cache/app-styles.css`, a copy of the real compiled app CSS (`npx vite build` output, bypassing `tsc -b` — see below). Re-sync must regenerate this file the same way before rebuilding, or styles silently go stale.
- Compiled CSS referenced fonts via root-relative `url(/assets/...)`, which `path.resolve` treats as OS-absolute (outside the extractor's allowed roots) → `[FONT_DANGLING]`. Fixed by rewriting `/assets/` → `./assets/` in the cached CSS and copying the actual `dist/assets/*.woff2` files alongside it at `.design-sync/.cache/assets/`. **Re-sync must repeat this rewrite** when regenerating `app-styles.css`.

## `tsc -b` fails on pre-existing app bugs
`yarn build` (`tsc -b && vite build`) fails typecheck on ~15 pre-existing errors unrelated to this sync (e.g. `TaskCard.tsx` `isArchived` missing from `Task` type, `AppSidebar.tsx` casing mismatch). **Use `npx vite build` directly** (skips `tsc`) to regenerate `dist/` for the compiled CSS. Do not attempt to fix these app bugs as part of a design-sync run — out of scope.

## Fork: `.design-sync/overrides/source-kit.mjs`
Two upstream bugs in the package-shape synth-entry path, both hit hard by this repo (components mostly `export default`):
1. `export * from "path"` never forwards a file's `default` export (ES module semantics) — 52/198 components silently missing from `window.Recur` (`[BUNDLE_EXPORT]`). Fixed by also emitting `export { default as Name } from "path"` per default export, with `componentSrcMap` used as tie-break for genuine name collisions (see below).
2. The upstream component-list logic gates the `deriveComponentsFromSrc` src-scan fallback behind `!components.length` — but `componentSrcMap` entries get added to that list FIRST, so pinning even one component collapses discovery from 198 down to just the pinned name(s). Fixed by always deriving from src/ when `synthEntry` is true, applying `componentSrcMap` as an overlay (matches the documented "pins/adds/excludes" semantics) instead of a gate.
- Both bugs reported upstream via product feedback.
- Needs `.design-sync/node_modules` pointing at `.ds-sync/node_modules` (ts-morph) — see fresh-clone setup below.

## Real source bug found (not fixed — not ours to fix)
`src/components/molecules/AppSidebarUserPopover.tsx` has an internal function literally named `AppSidebarUser` (default-exported), colliding with the real `src/components/organisms/AppSidebarUser.tsx` component. Pinned the real one via `cfg.componentSrcMap.AppSidebarUser`. Worth a one-line rename in the app source (`AppSidebarUserPopover`) at some point, but out of scope here.

## Preview-authoring conventions for this repo
- Components use base-ui's **render-prop composition** (`<DialogTrigger render={<Button/>} />`), not Radix's `asChild`. Check the actual primitive's `.d.ts`/source before assuming prop names.
- Import components in previews exactly the way the app does (`@/components/ui/button`, `@/components/organisms/TaskCard`, ...) — the story-imports plugin redirects any import that resolves to an exported component's module to `window.Recur`, however it's spelled, so path aliases work fine and keep previews honest about real usage.
- App content is German-facing in places (date labels render as "Bis 31.12.2026" etc. via `date-fns` German formatting) — that's correct, not a bug, when it shows up in a TaskCard-family preview.
- `Task` type (`@/services/taskService`): `TaskCategory` is `WORK|PERSONAL|SCHOOL|OTHER` (no `SPORT`); `TaskFrequency` is `DAILY|WEEKLY|MONTHLY|YEARLY|ONCE`.

## Fresh-clone / new-machine setup
1. `yarn install --immutable`
2. `npx vite build` (NOT `yarn build` — see `tsc -b` note above), then re-copy+rewrite the compiled CSS/fonts into `.design-sync/.cache/` per the "Styling" note above.
3. Re-stage converter scripts: `mkdir -p .ds-sync && cp -r <skill-dir>/{package-build.mjs,package-validate.mjs,package-capture.mjs,resync.mjs,lib,storybook} .ds-sync/` then `cd .ds-sync && npm i esbuild ts-morph @types/react playwright && npx playwright install chromium`
4. Recreate the fork's node_modules access: `ln -sfn ../.ds-sync/node_modules .design-sync/node_modules` (on this Windows/git-bash setup, `ln -sfn` did not create a real symlink but did leave a working copy — good enough, just not automatically kept in sync on a `.ds-sync` dep bump; re-run the link step if `ts-morph` resolution breaks).

## Tailwind JIT: only classes already used somewhere in `src/` exist in the shipped CSS
`cfg.cssEntry` is the real compiled app CSS (Tailwind v4 JIT, tree-shaken to classes actually referenced in `src/`). A preview `.tsx` under `.design-sync/previews/` is NOT part of that scan (previews compile separately, after the app CSS is already built), so **any Tailwind utility class used in a preview that isn't already used somewhere in the real app source will be silently absent from the stylesheet** — the element renders unstyled/invisible with no error. Found by wave1-b (`Skeleton`'s `w-9`/`space-y-*`/`h-3.5`/`w-3/5` etc. were all missing). Before using an uncommon utility class in a preview, grep `.design-sync/.cache/app-styles.css` for the literal class (e.g. `grep -- "\.w-80" .design-sync/.cache/app-styles.css`) or check it's already used somewhere under `src/`; prefer values already demonstrated in real component source. This applies to every wave, not just wave1-b — worth a final sweep across all authored previews.

## Known render warns (triaged, not bugs)
The ~22 sub-part components (`AlertDialogFooter`, `DialogFooter`, `SheetFooter`, `SidebarGroup`, `SidebarMenuItem`, etc.) render blank/thin alone in the floor card — they're compound sub-parts meant to be used inside their parent (no `.d.ts`-derived subcomponent grouping is available without a real dist, so they don't auto-nest under their parent like a typed DS would). Not a failure; they ship functional or get folded into their parent's authored preview when that parent is in the authored set.

## Re-sync risks
- `componentSrcMap` and any future `cfg.overrides` need re-verifying against the source-kit fork's logic if upstream's `lib/source-kit.mjs` changes shape — diff the fork against bundled `lib/source-kit.mjs` on every re-sync (per Troubleshooting) and re-apply the two fixes above if upstream hasn't shipped them.
- `.design-sync/.cache/app-styles.css` and `.design-sync/.cache/assets/` are machine-generated but NOT reproduced automatically by `package-build.mjs` — a re-sync that forgets step 2 above will silently ship stale/missing styles or dangling fonts.
- Preview authoring is scoped to a ~40-component "core" set (see conversation / PR description); the remaining ~155 components (mostly shadcn primitive sub-parts, and app-specific one-off pages/auth/error screens) intentionally ship as floor cards — fully functional and importable, just unauthored. Upgradeable incrementally on any future re-sync.
