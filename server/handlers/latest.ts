import { json } from 'itty-router'

export async function handleLatest(request: Request, env: Env) {
  const row = await env.DB
    .prepare('SELECT ts, download, upload, device FROM speed_log ORDER BY ts DESC LIMIT 1')
    .first<{ ts: string; download: number; upload: number; device: string }>()

  if (!row) {
    return json({ ts: null, download: null, upload: null })
  }

  return json(row)
}
