# TECHSTACK.md — AI-Maintained Web Application

## PURPOSE OF THIS DOCUMENT
Machine-readable specification of the complete technology stack for an AI-developed and AI-maintained web application. Each entry states what the tool is, what role it plays, why it was chosen, and what it connects to. This document is the authoritative reference for architectural decisions.

For this repository, treat entries for layers that are **not yet implemented in the codebase** as the default choice to use when that layer is added. They are architectural defaults, not proof that the wiring already exists today.

---

## CONSTRAINTS AND GUIDING PRINCIPLES

- **TypeScript everywhere**: All code is TypeScript with strict mode enabled. No `any`, no implicit types.
- **Explicit over implicit**: Configuration is declared, not inferred. Conventions are written down, not assumed.
- **Boundaries are validated**: Every data boundary (API input, DB output, form submission, env variable) is validated with Zod at runtime.
- **One repo**: Frontend and backend live in the same Next.js repository unless background services require separation.
- **Self-verifiable changes**: After every change, the AI runs `type-check`, `lint`, and `test` to verify correctness before finishing.

---

## LAYER 1 — LANGUAGE & RUNTIME

### TypeScript (strict)
- **Role**: Primary language for all application code — frontend, backend, scripts, and configuration.
- **Why**: Strict types act as machine-readable contracts. The AI can refactor, extend, and modify code without reading every file, because types communicate intent and catch mistakes at compile time.
- **Config**: `tsconfig.json` with `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`.
- **Connects to**: Everything. All other tools are chosen for first-class TypeScript support.

### Node.js (via Bun or standard Node)
- **Role**: Runtime for the Next.js server, scripts, and tooling.
- **Why**: Universal JS runtime with the largest ecosystem coverage in AI training data.
- **Note**: Bun can be used as a drop-in for faster installs and script execution, but standard Node.js is safer for production compatibility.

---

## LAYER 2 — FRAMEWORK

### Next.js 15+ (App Router)
- **Role**: Full-stack framework. Handles routing, server-side rendering, API routes, server actions, static generation, and deployment packaging.
- **Why**: Single framework for both frontend and backend eliminates cross-repo coordination. App Router conventions are explicit and file-based — the AI always knows where to put things. Largest training data coverage of any React framework.
- **Key conventions**:
  - `src/app/` — all routes and pages
  - `src/app/api/` — REST-style route handlers when the app adds an API layer
  - `src/actions/` — server actions for mutations when introduced
  - `src/components/` — UI components
  - `src/lib/` — shared utilities, DB clients, schemas
- **Connects to**: Every other layer. Acts as the integration point for the full stack.

---

## LAYER 3 — FRONTEND UI

### React 19+ (via Next.js)
- **Role**: UI component model. All UI is built as composable, typed React components.
- **Why**: Default in Next.js. Massive training data coverage. Component isolation means the AI can modify one component without side effects elsewhere.
- **Pattern**: Server Components by default. Client Components (`"use client"`) only when browser APIs or interactivity is required.

### Tailwind CSS (v4)
- **Role**: Utility-first CSS framework. All styling is written as className utilities directly in the component.
- **Why**: Eliminates stylesheet context-switching. The AI sees complete styling information inline with the component. No cascade debugging. No specificity conflicts. Consistent design tokens live alongside the app in a CSS-first setup.
- **Config**: Tailwind v4 tokens are defined in `src/app/globals.css` via `@theme {}`. There is no `tailwind.config.ts` in this repository.
- **Connects to**: shadcn/ui (uses Tailwind internally), all React components.

### shadcn/ui
- **Role**: Component library. Provides accessible, composable base components (Button, Dialog, Form, Table, etc.).
- **Why**: Components are copied into the repo at `src/components/ui/` — the AI can read and modify the actual source. No black-box npm dependency. Built on Radix UI primitives (accessibility) and Tailwind (styling).
- **Installation**: `npx shadcn@latest add [component]` — components are copied into the repo, not installed as an npm dependency. shadcn itself does not appear in `package.json`.
- **Actual npm deps added**: `@radix-ui/*`, `class-variance-authority`, `tailwind-merge`, `clsx`
- **Connects to**: Tailwind CSS, Radix UI (peer dependency), all feature components.

### React Hook Form
- **Role**: Form state management and submission handling.
- **Why**: Minimal re-renders, TypeScript-native, integrates directly with Zod via `@hookform/resolvers`. The AI can wire a form schema to a form component with a predictable, three-step pattern every time.
- **Pattern**: Schema defined in Zod → passed to `useForm` via `zodResolver` → fields registered with `register`.
- **Connects to**: Zod (validation schemas), shadcn/ui form components.

### Zustand
- **Role**: Client-side global state management, used only when state must be shared across components that cannot receive it via props or server data.
- **Why**: Minimal API surface. Store is a single typed function. The AI can add, read, and modify stores without understanding a complex system.
- **Rule**: Do not use for server data. Use for UI state only (e.g., sidebar open/closed, modal state, user preferences).
- **Connects to**: React components only.

---

## LAYER 4 — VALIDATION

### Zod
- **Role**: Runtime schema validation and TypeScript type inference. Used at every data boundary in the application.
- **Why**: Single schema definition generates both the runtime validator and the TypeScript type. The AI defines a schema once and uses it across API input validation, form validation, and environment variable parsing. Eliminates type/runtime drift.
- **Usage locations**:
  - `lib/validations/` — all shared schemas
  - API route handlers — validate `req.json()` before any processing
  - Server actions — validate `FormData` before DB writes
  - `env.ts` — validate `process.env` at startup
- **Connects to**: React Hook Form, API route handlers, Server Actions, Prisma (input shaping), environment config.

---

## LAYER 5 — BACKEND API

### Next.js Route Handlers (`app/api/`)
- **Role**: REST-style HTTP endpoints for external integrations, webhooks, and public API consumers.
- **Why**: Co-located with the frontend in the same repo and deployment. TypeScript end-to-end. No separate server to manage.
- **Pattern**: Every handler validates input with Zod, calls a service function from `lib/`, and returns a typed response.
- **Connects to**: Zod (validation), lib/services (business logic), external clients.

### Next.js Server Actions (`actions/`)
- **Role**: Type-safe server functions called directly from React components for data mutations (create, update, delete).
- **Why**: Eliminates the need for a separate API endpoint for internal mutations. Types flow from server to client automatically. The AI calls a server action the same way it calls any async function.
- **Pattern**: Defined in `actions/*.actions.ts`, called from Client Components or forms.
- **Connects to**: Zod (input validation), Prisma (DB writes), React components.

---

## LAYER 6 — DATABASE

### PostgreSQL
- **Role**: Primary relational database. Stores all persistent application data.
- **Why**: Industry standard. Excellent TypeScript tooling. Supported by all managed providers. The AI has extensive knowledge of PostgreSQL query patterns and constraints.
- **Provider**: Neon (serverless Postgres) — HTTP-based connections, auto-scaling, branching for preview environments, free tier available.
- **Connects to**: Prisma ORM.

### Prisma ORM
- **Role**: Database client, schema management, and migration tool.
- **Why**: `schema.prisma` is a single, human-readable file that defines the entire data model. The AI reads and modifies this file to understand and change the DB structure. Auto-generates a fully typed client — no raw SQL required for standard queries.
- **Key files**:
  - `prisma/schema.prisma` — authoritative data model
  - `prisma/migrations/` — migration history (append-only, never edited)
- **Critical rule**: Never edit existing migration files. Always run `prisma migrate dev --name <description>` to create new migrations.
- **Connects to**: PostgreSQL (Neon), all `lib/db/` query functions.

---

## LAYER 7 — AUTHENTICATION

### Better Auth
- **Role**: Authentication system. Handles session management, OAuth providers, email/password, magic links, and user account lifecycle.
- **Why**: Open-source, code lives in the repo, TypeScript-native, integrates directly with Prisma and the existing DB schema. The AI can read and modify auth logic. Avoids vendor lock-in.
- **Config**: Defined in `lib/auth/auth.ts`. Session data typed and available in server components and route handlers.
- **Connects to**: Prisma (user/session tables), Next.js middleware (route protection), React components (session hooks).

---

## LAYER 8 — BACKGROUND JOBS

### Inngest
- **Role**: Background job queue and scheduled task runner.
- **Why**: Jobs are TypeScript functions, not YAML configs. No separate infrastructure to manage. The AI writes a job the same way it writes any other function. Supports retries, delays, fan-out, and step functions natively.
- **Pattern**: Functions defined in `lib/inngest/functions/`, registered in `app/api/inngest/route.ts`.
- **Use cases**: Email sending, data processing, scheduled tasks, webhook fan-out.
- **Connects to**: Inngest cloud (event bus), Resend (email jobs), Prisma (data jobs).

---

## LAYER 9 — EMAIL

### Resend
- **Role**: Transactional email delivery service.
- **Why**: Simple REST API with a TypeScript SDK. Clean developer experience with high deliverability.
- **Connects to**: React Email (templates), Inngest (triggered via background jobs).

### React Email
- **Role**: Email template system. Templates are written as React components and rendered to HTML.
- **Why**: The AI already knows React. Templates are written with the same component patterns as the UI — no separate templating language to learn.
- **Location**: `emails/` directory at project root.
- **Connects to**: Resend (renders templates to HTML for delivery).

---

## LAYER 10 — FILE STORAGE

### Uploadthing
- **Role**: File upload handling and storage for user-generated files (images, documents, avatars).
- **Why**: TypeScript-native, integrates with Next.js Route Handlers, handles presigned URLs, file validation, and CDN delivery. The AI configures upload routes with typed file constraints.
- **Connects to**: Next.js Route Handlers (upload endpoint), React components (upload UI), PostgreSQL (stores file URLs).

---

## LAYER 11 — CACHING & RATE LIMITING

### Upstash Redis
- **Role**: Serverless Redis for rate limiting, session caching, and ephemeral data.
- **Why**: HTTP-based Redis client — works in serverless and edge environments. TypeScript SDK. Free tier available.
- **Use cases**: API rate limiting per IP/user, caching expensive DB queries, idempotency keys for background jobs.
- **Connects to**: Next.js middleware (rate limiting), Route Handlers (caching layer).

---

## LAYER 12 — MONITORING & OBSERVABILITY

### Sentry
- **Role**: Error tracking and performance monitoring.
- **Why**: Industry standard. Next.js SDK auto-instruments routes and server actions. The AI can add `Sentry.captureException()` at error boundaries consistently.
- **Config**: `sentry.server.config.ts`, `sentry.client.config.ts`, `sentry.edge.config.ts`.
- **Connects to**: Next.js (auto-instrumentation), all layers (manual error capture).

### Vercel Analytics + Speed Insights
- **Role**: Web analytics and Core Web Vitals tracking.
- **Why**: Zero-config with Vercel deployment. No cookies, privacy-friendly. The AI adds `<Analytics />` and `<SpeedInsights />` once to the root layout.
- **Connects to**: Next.js root layout only.

---

## LAYER 13 — TESTING

### Vitest
- **Role**: Unit and integration test runner.
- **Why**: Jest-compatible API, ESM-native, fast. The AI writes tests in the same syntax as Jest — no new patterns to learn.
- **Location**: Test files co-located with source as `*.test.ts` or in `__tests__/`.
- **Connects to**: All `lib/` functions, Server Actions, utility functions.

### Playwright
- **Role**: End-to-end browser testing.
- **Why**: TypeScript-native, excellent Next.js support, auto-waits reduce flaky tests. The AI writes E2E tests that mirror user flows.
- **Location**: `e2e/` directory at project root.
- **Connects to**: Running Next.js dev server.

### MSW (Mock Service Worker)
- **Role**: API mocking for frontend component tests.
- **Why**: Intercepts real fetch calls at the network level — no mocking of module internals. Tests run the same code as production.
- **Connects to**: Vitest, Playwright (for mocking external APIs).

---

## LAYER 14 — CODE QUALITY

### ESLint
- **Role**: Static code analysis and rule enforcement.
- **Config**: `eslint.config.ts` with `@typescript-eslint/strict`, `eslint-config-next`, and custom rules.
- **Connects to**: CI pipeline, pre-commit hook.

### Prettier
- **Role**: Code formatter. Enforces consistent formatting automatically.
- **Config**: `.prettierrc` — single quotes, no semicolons (or whatever is decided — the key is that it is decided once and never revisited).
- **Connects to**: ESLint (via `eslint-config-prettier`), pre-commit hook.

### Husky + lint-staged
- **Role**: Git pre-commit hooks. Runs ESLint and Prettier on staged files before every commit.
- **Why**: Catches AI formatting mistakes before they enter version control.
- **Connects to**: ESLint, Prettier, TypeScript compiler.

---

## LAYER 15 — DEPLOYMENT & INFRASTRUCTURE

### Vercel
- **Role**: Hosting, deployment, and CDN for the Next.js application.
- **Why**: First-party Next.js support. Zero-config deployment. Preview deployments on every PR branch. Edge network for static assets.
- **Config**: `vercel.json` for any custom headers, rewrites, or function regions.
- **Connects to**: GitHub (auto-deploy on push), Neon (DB), all environment variables.

### GitHub
- **Role**: Version control and CI/CD trigger.
- **Connects to**: Vercel (deployment trigger), GitHub Actions (CI pipeline).

### GitHub Actions
- **Role**: CI pipeline. Runs on every pull request.
- **Pipeline steps**: Install → Type check → Lint → Unit tests → Build
- **File**: `.github/workflows/ci.yml`
- **Connects to**: Vercel (deployment after CI passes).

### Environment Variables
- **Role**: Runtime configuration for secrets and environment-specific values.
- **Management**: Stored in Vercel dashboard for production. `.env.local` for local development. Never committed to version control.
- **Validation**: All env vars are parsed and validated with Zod in `lib/env.ts` at application startup. Unset required variables cause a hard crash at boot, not a runtime error.
- **File**: `lib/env.ts` — single source of truth for all environment configuration.

---

## LAYER 16 — PROJECT CONVENTIONS (CLAUDE.md)

A `CLAUDE.md` file at the project root is read by AI coding agents before every session. In this repository it is symlinked to `AGENTS.md`. It contains:

```
## Commands
- `pnpm dev` — start development server
- `pnpm build` — production build and type validation
- `pnpm lint` — ESLint
- `pnpm test` — Vitest in watch mode
- `pnpm test:run` — single-run tests plus Lighthouse pipeline
- `pnpm storybook` — Storybook on `@storybook/react-vite`

## After every change
Run: `pnpm build && pnpm lint`
If tests exist for the modified module, run: `pnpm test` or `pnpm test:run` when Lighthouse is relevant

## Architecture rules
- Validate all external input with Zod before any processing
- Never expose raw DB IDs in API responses — use cuid2 identifiers
- API errors return `{ error: string, code?: string }` — nothing else
- All DB queries live in `lib/db/` — never inline in route handlers or components
- Never edit files in `prisma/migrations/` — create new migrations only
- Client Components are the exception, not the default — justify their use
- Background jobs go in Inngest — never block an API response with slow work

## File naming
- React components: PascalCase (`UserProfile.tsx`)
- Utilities and hooks: camelCase (`useAuth.ts`, `formatDate.ts`)
- Route files: Next.js convention (`page.tsx`, `route.ts`, `layout.tsx`)
- Schema files: kebab-case with `.schema.ts` suffix (`user.schema.ts`)
- Test files: same name as source with `.test.ts` suffix

## Commit format (Conventional Commits)
feat: add user profile page
fix: correct session expiry calculation
refactor: extract email logic to lib/email
chore: update dependencies
```

---

## COMPLETE DEPENDENCY MAP

```
Request
  └── Next.js (routing + middleware)
        ├── Upstash Redis (rate limiting in middleware)
        ├── Better Auth (session validation)
        └── Route Handler / Server Action
              ├── Zod (input validation)
              ├── lib/db/ (query layer)
              │     └── Prisma → Neon PostgreSQL
              ├── Inngest (dispatch background jobs)
              │     └── Resend + React Email (email jobs)
              └── Uploadthing (file handling)

Response
  └── React (server components → client hydration)
        ├── Tailwind CSS (styling)
        ├── shadcn/ui (base components)
        ├── React Hook Form + Zod (form handling)
        └── Zustand (client state, minimal)

Observability
  └── Sentry (errors, all layers)
  └── Vercel Analytics (web vitals, root layout)

CI/CD
  └── GitHub → GitHub Actions → Vercel
        └── Pipeline: build → lint → test → deploy
```

---

## PACKAGE SUMMARY

> **Note**: `"latest"` is used here to show intent. In production, pin exact versions using `npm install [package]` and commit `package-lock.json`. Run `npm audit` regularly.
> **Note**: `shadcn/ui` components are not installed as a package. Run `npx shadcn@latest add [component]` per component. Its runtime deps (`@radix-ui/*`, `class-variance-authority`, `tailwind-merge`, `clsx`) are listed below.

```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "typescript": "latest",
    "zod": "latest",
    "prisma": "latest",
    "@prisma/client": "latest",
    "better-auth": "latest",
    "inngest": "latest",
    "resend": "latest",
    "@react-email/components": "latest",
    "uploadthing": "latest",
    "@upstash/redis": "latest",
    "@upstash/ratelimit": "latest",
    "@sentry/nextjs": "latest",
    "react-hook-form": "latest",
    "@hookform/resolvers": "latest",
    "zustand": "latest",
    "tailwindcss": "latest",
    "@tailwindcss/typography": "latest",
    "@paralleldrive/cuid2": "latest",
    "class-variance-authority": "latest",
    "tailwind-merge": "latest",
    "clsx": "latest"
  },
  "devDependencies": {
    "vitest": "latest",
    "playwright": "latest",
    "msw": "latest",
    "eslint": "latest",
    "prettier": "latest",
    "husky": "latest",
    "lint-staged": "latest",
    "@typescript-eslint/eslint-plugin": "latest",
    "eslint-config-next": "latest",
    "eslint-config-prettier": "latest"
  }
}
```
