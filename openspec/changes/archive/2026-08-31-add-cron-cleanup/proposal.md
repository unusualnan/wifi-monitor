## Why

The `speed_log` table grows indefinitely. Every upload adds records but nothing removes them. Over time this increases D1 storage costs and query latency. A periodic cleanup mechanism is needed to automatically delete records older than a configurable retention window.

## What Changes

- Add a `scheduled` handler to the Cloudflare Worker that runs on a cron schedule
- Configure a cron trigger in `wrangler.jsonc`
- Implement DELETE logic to remove records older than N days
- Make retention period configurable via environment variable

## Capabilities

### New Capabilities

- `cron-cleanup`: Scheduled deletion of expired speed_log records from D1

### Modified Capabilities

<!-- None - this is additive -->

## Impact

- `server/index.ts`: Add `scheduled` export handler with DELETE query
- `wrangler.jsonc`: Add `triggers.crons` configuration
- D1 database: periodic write operations (DELETE) on a schedule
- No frontend changes required
