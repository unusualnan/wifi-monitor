const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json', ...corsHeaders },
	})
}

async function handleUpload(request: Request, db: D1Database) {
	const body = await request.json<{ records?: { ts: string; download: number; upload: number }[] }>()

	if (!body.records || !Array.isArray(body.records)) {
		return json({ ok: false, error: 'missing records' }, 400)
	}

	if (body.records.length === 0) {
		return json({ ok: true, count: 0 })
	}

	const stmt = db.prepare('INSERT INTO speed_log (ts, download, upload) VALUES (?, ?, ?)')
	const results = await db.batch(
		body.records.map((r) => stmt.bind(r.ts, r.download, r.upload)),
	)

	return json({ ok: true, count: results.length })
}

async function handleLatest(db: D1Database) {
	const row = await db
		.prepare('SELECT ts, download, upload, device FROM speed_log ORDER BY ts DESC LIMIT 1')
		.first<{ ts: string; download: number; upload: number; device: string }>()

	if (!row) {
		return json({ ts: null, download: null, upload: null })
	}

	return json(row)
}

async function handleHistory(request: Request, db: D1Database) {
	const url = new URL(request.url)
	const hoursParam = url.searchParams.get('hours') ?? '24'
	const hours = Number(hoursParam)

	if (isNaN(hours) || hours <= 0) {
		return json({ ok: false, error: 'invalid hours parameter' }, 400)
	}

	const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

	const { results } = await db
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

export default {
	async fetch(request, env) {
		const url = new URL(request.url)

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: corsHeaders })
		}

		if (url.pathname === '/api/upload' && request.method === 'POST') {
			return handleUpload(request, env.DB)
		}

		if (url.pathname === '/api/latest' && request.method === 'GET') {
			return handleLatest(env.DB)
		}

		if (url.pathname === '/api/history' && request.method === 'GET') {
			return handleHistory(request, env.DB)
		}

		return new Response(null, { status: 404 })
	},

	async scheduled(event, env) {
		await handleScheduled(env)
	},
} satisfies ExportedHandler<Env>
