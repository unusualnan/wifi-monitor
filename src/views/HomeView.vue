<script setup lang="ts">
import { useSpeedData } from '@/composables/useSpeedData'
import SpeedCard from '@/components/SpeedCard.vue'
import SpeedChart from '@/components/SpeedChart.vue'

const { latest, history, loading, refresh } = useSpeedData()
</script>

<template>
  <main>
    <header>
      <h1>WiFi Speed Monitor</h1>
      <button class="refresh" @click="refresh" :disabled="loading">
        {{ loading ? '刷新中...' : '刷新' }}
      </button>
    </header>
    <SpeedCard
      :download="latest.download"
      :upload="latest.upload"
      :ts="latest.ts"
    />
    <SpeedChart :records="history" :loading="loading" />
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  padding: 1.5rem;
  box-sizing: border-box;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

.refresh {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.9rem;
}

.refresh:hover:not(:disabled) {
  background: var(--color-background-mute);
}

.refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
