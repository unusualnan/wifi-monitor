## Context

The `wifi-monitor` project uses Cloudflare D1 to store speed test results in a `speed_log` table. Records are inserted via `/api/upload` but never deleted. Over time this causes unbounded growth. Cloudflare Workers support cron triggers via the `scheduled` handler, which is the natural fit for periodic cleanup.

Current state:
- `server/index.ts` exports only a `fetch` handler
- `wrangler.jsonc` has no cron configuration
- D1 binding is `DB`

## Goals / Non-Goals

**Goals:**
- Automatically delete records older than N days on a schedule
- Make retention configurable via environment variable
- Zero impact on fetch request handling

**Non-Goals:**
- Data aggregation or summarization before deletion
- Multiple cleanup schedules (e.g., different retention for different data)
- Frontend UI for managing retention settings

## Decisions

### Use Workers Cron Triggers (not application-level cleanup)

**Decision:** Implement cleanup in a `scheduled` handler triggered by Cloudflare cron.

**Alternatives considered:**
- Cleanup on write (`/api/upload`): Adds latency to every upload, and if no uploads occur, nothing gets cleaned.
- Lazy cleanup on read (`/api/history`): Unreliable, depends on traffic.
- External cron (GitHub Actions): Requires maintaining an external service and an admin endpoint.

**Rationale:** Cron triggers are native to Cloudflare Workers, run independently of request traffic, and keep cleanup logic isolated from serving logic.

### Single DELETE per execution

**Decision:** Execute one `DELETE FROM speed_log WHERE ts < ?` statement per cron invocation.

**Alternatives considered:**
- Batched deletes (delete in chunks of 1000): More complex, unnecessary for the expected data volume.
- SELECT then DELETE: Adds a round trip for no benefit since SQL can filter directly.

**Rationale:** D1 handles single-statement deletes efficiently. For a daily cleanup of modest data, a single DELETE is sufficient.

### Environment variable for retention

**Decision:** Use `RETENTION_DAYS` env var with a default of 30 days.

**Rationale:** Simple, familiar Cloudflare pattern. Wrangler vars are easy to configure per environment.

## Risks / Trade-offs

- **Risk:** Large deletes could hit D1 write limits if the table grows very large between cleanups.
  **Mitigation:** Daily cleanup keeps each delete small. Can increase frequency if needed.

- **Risk:** Cron triggers have a minimum schedule of once per minute on paid plans, once per day on free.
  **Mitigation:** Daily is sufficient for this use case. Free tier limitation is acceptable.

## Migration Plan

1. Add `scheduled` handler to `server/index.ts`
2. Add `RETENTION_DAYS` to wrangler vars (optional, has default)
3. Add `triggers.crons` to `wrangler.jsonc`
4. Deploy with `pnpm deploy`

Rollback: Remove the cron trigger from `wrangler.jsonc` and redeploy. Existing data remains intact.

## Open Questions

- None outstanding.
