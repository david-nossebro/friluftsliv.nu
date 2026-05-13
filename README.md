# friluftsliv.nu

Swedish outdoor-recreation site (rutter, stugor, naturområden) built with
Next.js 15 App Router, React 19, TypeScript, Tailwind v4, and shadcn/ui. UI-first
with static seed content under `src/data/`.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm storybook    # http://localhost:6006
pnpm build        # production build (also acts as typecheck)
pnpm lint
pnpm test         # Vitest (unit + a11y) in watch mode
pnpm test:run     # single-run tests + Lighthouse pipeline
```

## Where to look

- [`AGENTS.md`](./AGENTS.md) — operating manual for coding agents (stack
  overview, repo map, working agreements). Symlinked as `CLAUDE.md`.
- [`TECHSTACK.md`](./TECHSTACK.md) — forward-looking tooling charter (what
  to reach for when adding a new layer: DB, auth, jobs, email, monitoring,
  storage, rate limiting).
- [`Brand/BRAND.md`](./Brand/BRAND.md) — brand voice, palette, do/don't.
- [`Design/`](./Design/) — design-system HTML references.
