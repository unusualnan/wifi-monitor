import { json } from 'itty-router'
import type { SpeedRecord } from '@/shared/types'

export async function handleHistory(request: Request, env: Env) {
  const url = new URL(request.url)
  const hoursParam = url.searchParams.get('hours') ?? '24'
  const hours = Number(hoursParam)

  if (isNaN(hours) || hours <= 0) {
    return json({ ok: false, error: 'invalid hours parameter' }, { status: 400 })
  }

  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

  const { results } = await env.DB
    .prepare('SELECT ts, download, upload FROM speed_log WHERE ts >= ? ORDER BY ts ASC')
    .bind(since)
    .all<SpeedRecord>()

  return json({ records: results })
}
