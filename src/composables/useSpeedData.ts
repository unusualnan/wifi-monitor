import { ref, onMounted, onUnmounted } from 'vue'

interface SpeedRecord {
  ts: string
  download: number
  upload: number
}

interface LatestSpeed {
  ts: string | null
  download: number | null
  upload: number | null
  device?: string
}

export function useSpeedData() {
  const latest = ref<LatestSpeed>({ ts: null, download: null, upload: null })
  const history = ref<SpeedRecord[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  let timer: ReturnType<typeof setInterval> | null = null

  async function fetchLatest() {
    try {
      const res = await fetch('/api/latest')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      latest.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch latest'
    }
  }

  async function fetchHistory(hours = 24) {
    try {
      loading.value = true
      error.value = null
      const res = await fetch(`/api/history?hours=${hours}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      history.value = data.records
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch history'
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    await Promise.all([fetchLatest(), fetchHistory()])
  }

  onMounted(() => {
    refresh()
    timer = setInterval(fetchLatest, 30_000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { latest, history, loading, error, refresh, fetchHistory }
}
