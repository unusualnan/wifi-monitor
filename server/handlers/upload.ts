import { json } from 'itty-router'

export async function handleUpload(request: Request, env: Env) {
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
