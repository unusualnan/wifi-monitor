## 1. Worker scheduled handler

- [x] 1.1 Add `scheduled` handler to `server/index.ts` with D1 DELETE query
- [x] 1.2 Read `RETENTION_DAYS` env var with default of 30
- [x] 1.3 Compute cutoff timestamp and execute `DELETE FROM speed_log WHERE ts < ?`

## 2. Wrangler configuration

- [x] 2.1 Add `triggers.crons` to `wrangler.jsonc` with daily schedule
- [x] 2.2 Add `RETENTION_DAYS` to `vars` in `wrangler.jsonc` (optional)

## 3. Type generation

- [x] 3.1 Run `pnpm cf-typegen` to update `worker-configuration.d.ts` with scheduled handler types
