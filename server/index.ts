import { AutoRouter, cors, json } from 'itty-router'

const { preflight, corsify } = cors()

async function handleUpload(request: Request, env: Env) {
  const body = await request.json<{ records?: { ts: string; download: number; upload: number }[] }>()

  if (!body.records || !Array.isArray(body.records)) {
    return json({ ok: false, error: 'missing records' }, { status: 400 })
  }

  if (body.records.length === 0) {
    return json({ ok: true, count: 0 })
  }

  const stmt = env.DB.prepare('INSERT INTO speed_log (ts, download, upload) VALUES (?, ?, ?)')
  const results = await env.DB.batch(
    body.records.map((r) => stmt.bind(r.ts, r.download, r.upload)),
  )

  return json({ ok: true, count: results.length })
}

async function handleLatest(request: Request, env: Env) {
  const row = await env.DB
    .prepare('SELECT ts, download, upload, device FROM speed_log ORDER BY ts DESC LIMIT 1')
    .first<{ ts: string; download: number; upload: number; device: string }>()

  if (!row) {
    return json({ ts: null, download: null, upload: null })
  }

  return json(row)
}

async function handleHistory(request: Request, env: Env) {
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
    .all<{ ts: string; download: number; upload: number }>()

  return json({ records: results })
}

async function handleScheduled(env: Env) {
  const retentionDays = Number(env.RETENTION_DAYS) || 30
  const cutoff = new Date(Date.now() - retentionDays * 86400000).toISOString()
  await env.DB.prepare('DELETE FROM speed_log WHERE ts < ?').bind(cutoff).run()
}

const router = AutoRouter({
  before: [preflight],
  finally: [corsify],
})

router
  .post('/api/upload', handleUpload)
  .get('/api/latest', handleLatest)
  .get('/api/history', handleHistory)

export default {
  ...router,
  scheduled: async (controller: ScheduledController, env: Env) => {
    await handleScheduled(env)
  },
} satisfies ExportedHandler<Env>
