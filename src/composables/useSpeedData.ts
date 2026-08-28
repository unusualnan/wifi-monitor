import { ref, watch, onMounted, onUnmounted } from 'vue'

export interface SpeedRecord {
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
  const autoRefresh = ref(true)
  const refreshInterval = ref(30)

  let timer: ReturnType<typeof setInterval> | null = null

  function clearTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function startTimer() {
    clearTimer()
    if (autoRefresh.value && refreshInterval.value > 0) {
      timer = setInterval(fetchLatest, refreshInterval.value * 1000)
    }
  }

  async function fetchLatest() {
    try {
      const res = await fetch('/api/latest')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      latest.value = data

      if (data.ts && data.download !== null && data.upload !== null) {
        const exists = history.value.some((r) => r.ts === data.ts)
        if (!exists) {
          history.value = [...history.value, { ts: data.ts, download: data.download, upload: data.upload }]
        }
      }
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

  watch([autoRefresh, refreshInterval], startTimer)

  onMounted(() => {
    refresh()
    startTimer()
  })

  onUnmounted(clearTimer)

  return { latest, history, loading, error, refresh, fetchHistory, autoRefresh, refreshInterval }
}
