import { ref, watch } from 'vue'

export function useAutoRefresh(callback: () => void) {
  const autoRefresh = ref(true)
  const refreshInterval = ref(30)

  let timer: ReturnType<typeof setInterval> | null = null

  function clearTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function start() {
    clearTimer()
    if (autoRefresh.value && refreshInterval.value > 0) {
      timer = setInterval(callback, refreshInterval.value * 1000)
    }
  }

  function stop() {
    clearTimer()
  }

  watch([autoRefresh, refreshInterval], start)

  return { autoRefresh, refreshInterval, start, stop }
}
