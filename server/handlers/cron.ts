export async function handleScheduled(env: Env) {
  const retentionDays = Number(env.RETENTION_DAYS) || 30
  const cutoff = new Date(Date.now() - retentionDays * 86400000).toISOString()
  await env.DB.prepare('DELETE FROM speed_log WHERE ts < ?').bind(cutoff).run()
}
