# friluftsliv.nu — Agents Guide

Swedish outdoor-recreation site (rutter, stugor, naturområden). UI-first Next.js
App Router app with static seed data. Brand voice is Swedish, calm, inclusive —
see `Brand/BRAND.md`.

## Stack at a glance

- **Next.js 15 + React 19** (App Router, RSC by default)
- **TypeScript strict**, path alias `@/* → src/*`
- **Tailwind v4** — CSS-first config in `src/app/globals.css` `@theme {}`. No
  `tailwind.config.ts`.
- **shadcn/ui** copied into `src/components/ui/`, Radix primitives, `lucide-react`,
  `cn()` helper in `src/lib/utils.ts`
- **Leaflet + react-leaflet + leaflet.markercluster** — client-only, lazy via
  `next/dynamic` `{ ssr: false }`
- **Storybook 8.6 on `@storybook/react-vite`** (not `@storybook/nextjs`, which
  broke with a webpack `tap` API error). Do not install `@storybook/nextjs-vite`
  — it is Storybook 10 and incompatible.
- **Vitest** with two projects: `unit` (jsdom + RTL + `vitest-axe`) and
  `storybook` (Playwright browser via `@storybook/experimental-addon-test`)
- **Lighthouse CI** (mobile + desktop) orchestrated by `scripts/lighthouse-run.mjs`
- **No backend, DB, auth, or jobs yet.** Content lives as typed arrays in
  `src/data/`. `TECHSTACK.md` is the chosen technology charter for the
  project — when future work needs a layer that doesn't exist yet (DB, auth,
  email, jobs, monitoring, file storage, rate limiting), follow the tool it
  specifies for that layer (Prisma, Better Auth, Inngest, Resend, Sentry,
  Uploadthing, Upstash Redis) instead of choosing a different one. Just
  don't assume those layers are already wired up — they aren't.

**Package manager: pnpm.** A `package-lock.json` may exist but is stale;
`node_modules/.pnpm` is the source of truth.

## Repo map

- `src/app/` — App Router pages with Swedish URLs: `/`, `/karta`, `/om`,
  `/utforska`, `/turer/[id]`, `/stugor/[id]`. Root layout sets `lang="sv"`.
- `src/components/` — grouped by feature, not atomic-design tiers. Each
  non-trivial component has a sibling `*.stories.tsx`.
  - `ui/` — shadcn primitives + project variants (`button`, `badge`, `input`,
    `avatar`, `icon`, `filter-chip`). Lowercase filenames per shadcn
    convention. Add new ones with `pnpm dlx shadcn@latest add <name>` and edit
    them in place to use brand tokens (`bg-pine`, `text-snow`, ...) — don't
    wrap shadcn primitives in extra files.
  - `brand/` — logotype + loader.
  - `layout/` — `PageLayout`, `MapLayout`, `SiteHeader`, `SiteFooter`,
    `NotFoundPage`.
  - `cards/` — route/cabin/area cards, card grids, booking card.
  - `map/` — Leaflet wrappers, `MapView`, `MapSidebar`, layer toggles,
    `MapPromo`.
  - `search/` — `SearchBar`, hero/header search, activity chips,
    `ExploreView`/`Filters`/`Grid`.
  - `sections/` — page views (`HomePageView`, `AboutPageView`) and detail
    sections for route/cabin/about pages, plus `ContentBlock` and
    `ImageGallery`.
  - `common/` — small shared bits (`DifficultyBadge`, `StatItem`,
    `FacilityGrid`).
- `src/data/` — static seed data (`routes.ts`, `cabins.ts`, `areas.ts`,
  `suggestions.ts`) plus lookup helpers in `index.ts`.
- `src/lib/` — `utils.ts` (`cn`), `a11y.ts` (focus helpers), `gpx.ts`,
  `facilityIcons.ts`.
- `src/types/` — shared domain types and `DEFAULT_MAP_LAYERS`.
- `src/__mocks__/` — Storybook/Vitest stand-ins for `next/image`, `next/link`,
  `next/dynamic`, `next/navigation`. Aliased in `.storybook/main.ts` `viteFinal`.
- `src/test/setup.ts` — wires `vitest-axe` matchers and RTL cleanup.
- `.storybook/` — `main.ts` (config + Vite aliases), `preview.tsx` (fonts
  decorator + brand backgrounds), `vitest.setup.ts`.
- `scripts/lighthouse-run.mjs`, `scripts/lighthouse-summary.mjs` — audit
  pipeline. Reports land in `.lighthouseci/` (gitignored).
- `lighthouserc.mobile.js`, `lighthouserc.desktop.js` — LHCI assertions.
- `Design/` — `BRAND.md` (voice + palette), design-system HTML references.
- `inspiration-site/`, `artifacts/`, `.claude/` — local-only, gitignored.

## Common commands

- Dev server: `pnpm dev`
- Production build (also acts as typecheck; `tsconfig` is `noEmit`): `pnpm build`
- Lint: `pnpm lint`
- Unit + a11y tests (watch): `pnpm test`
- Single-run + full Lighthouse pipeline: `pnpm test:run`
- A11y tests verbose: `pnpm test:a11y`
- Storybook: `pnpm storybook` (port 6006), build with `pnpm build-storybook`
- Lighthouse only: `pnpm test:lighthouse` (mobile + desktop + summary)

## Working agreements

- **Swedish everywhere user-facing**: copy, route segments, `aria-label`s. UI
  copy follows `Design/BRAND.md` (use *du/dig*, short active sentences). The
  `/copy-writer-swedish` skill is the canon for marketing/microcopy.
- **Server Components by default.** Only add `'use client'` when a component
  needs browser APIs or interactivity — and justify the choice.
- **Tailwind tokens come from `globals.css`** (`@theme {}`). When you need a
  new color/size/shadow, add it as a CSS variable there rather than inventing
  an arbitrary value inline. Class merging goes through `cn()` from
  `@/lib/utils`.
- **Map code is client-only.** Anything that touches Leaflet must be loaded via
  `next/dynamic` with `ssr: false` (see `src/components/map/LeafletMap.tsx`).
- **Every non-trivial component gets a Storybook story.** Stories double as
  visual regression and accessibility surface (Storybook a11y addon + browser
  test project).
- **Accessibility is enforced, not aspirational.** `eslint-plugin-jsx-a11y` runs
  on every lint; component tests use `vitest-axe`'s `toHaveNoViolations`;
  Lighthouse mobile a11y is an *error* below 0.95. Don't regress these.
- **Add new shadcn components via the CLI**, not by hand. After adding, edit
  the primitive in `src/components/ui/<name>.tsx` to use brand tokens
  (`bg-pine`, `text-snow`, etc.) — don't introduce a separate wrapper layer.
- Keep diffs focused. Conventional Commits style (`feat:`, `fix:`, `chore:` —
  see recent history).

## Repo-specific gotchas

- **Don't switch Storybook frameworks.** Stay on `@storybook/react-vite`.
  `@storybook/nextjs` is broken here; `@storybook/nextjs-vite` is SB10 only.
- **Don't import `next/*` directly in stories** unless the alias mock covers
  it. New `next/*` surfaces need a mock under `src/__mocks__/` and a matching
  alias in `.storybook/main.ts` `viteFinal`.
- **`preview.tsx` uses `React.createElement`, not JSX.** JSX in `preview.tsx`
  triggers a Vite import-analysis parse error — leave the existing pattern in
  place.
- **Fonts are loaded via `@import url(...)` in `globals.css`**, not `next/font`.
  Variable fonts (Fraunces, DM Sans) are referenced via CSS variables
  (`--font-display`, `--font-body`).
- **Storybook browser tests run sequentially** (`fileParallelism: false` in
  `vitest.config.ts`) due to a flaky concurrent-init bug in
  `@storybook/experimental-addon-test@8.6` + Vitest 3. Don't re-enable parallel.
- **Lighthouse exit code:** the orchestrator returns the worst lhci exit so
  `pnpm test:run` fails when assertions trip. The build step is fatal; the
  audit steps are not — the summary always prints.
- **External image hosts must be allowlisted** in `next.config.ts`
  (`images.remotePatterns`). Currently only `images.unsplash.com`.
- `TECHSTACK.md` is the forward-looking tooling charter. Use it as the
  default when introducing a new layer, but don't import from packages it
  names until you've actually added them to `package.json` and the
  surrounding wiring (e.g. `lib/env.ts`, `prisma/schema.prisma`,
  `app/api/inngest/route.ts`) for that layer.

## Before finishing

- `pnpm build` (catches type + Next.js build errors — there is no separate
  `type-check` script)
- `pnpm lint`
- `pnpm test` (or `pnpm test:run` if changes are likely to affect Lighthouse
  scores — e.g. layout shifts, image work, route additions)
- If you touched a component, confirm its story still renders and Storybook
  tests pass.

## Pointers

- Brand voice, palette, do/don't: `Brand/BRAND.md`
- Component design references: `Design/design-system.html`,
  `Design/logotype-ridgeline-final.html`
- Forward-looking tooling charter (follow when adding new layers): `TECHSTACK.md`
- Lighthouse assertion thresholds: `lighthouserc.mobile.js`,
  `lighthouserc.desktop.js`
