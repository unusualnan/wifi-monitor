# AGENTS.md

## What this is

Vue 3 + TypeScript + Vite frontend deployed to Cloudflare Workers via `@cloudflare/vite-plugin`. Not a standard Cloudflare Worker — the Cloudflare plugin handles bundling and worker generation.

## Commands

- `pnpm install` — dependencies (pnpm workspace, requires Node `^22.18.0 || >=24.12.0`)
- `pnpm dev` — Vite dev server with HMR
- `pnpm build` — type-check + build (runs `vue-tsc --build` and `vite build` in parallel via `npm-run-all2`)
- `pnpm type-check` — `vue-tsc --build` only (not `tsc`)
- `pnpm preview` — build then `wrangler dev` (local Cloudflare preview)
- `pnpm deploy` — build then `wrangler deploy`
- `pnpm cf-typegen` — regenerate `worker-configuration.d.ts` via `wrangler types`

No lint, test, or formatter commands exist.

## Architecture

- `server/index.ts` — Cloudflare Worker entry point (exported fetch handler)
- `src/main.ts` — Vue app entry
- `src/router/` — vue-router with two routes: `/` (eager) and `/about` (lazy-loaded)
- `@` alias maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`)
- `wrangler.jsonc` sets SPA mode (`not_found_handling: "single-page-application"`)

## TypeScript

Three tsconfig files, all checked via `vue-tsc --build`:
- `tsconfig.app.json` — Vue frontend (`src/**/*`)
- `tsconfig.worker.json` — Cloudflare Worker code (`server/`)
- `tsconfig.node.json` — Vite/config tooling

`worker-configuration.d.ts` is generated — do not edit manually.

## Gotchas

- `build` script uses `run-p` (npm-run-all2) to run type-check and build in parallel. If one fails, the build still reports success from the other.
- No test framework is configured. Do not assume vitest/jest exists.
- The Cloudflare Worker dev server (`wrangler dev`) is separate from `pnpm dev` (Vite only).
