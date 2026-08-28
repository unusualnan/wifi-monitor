<script setup lang="ts">
import { useSpeedData } from '@/composables/useSpeedData'
import SpeedCard from '@/components/SpeedCard.vue'
import SpeedChart from '@/components/SpeedChart.vue'

const { latest, history, loading, refresh, autoRefresh, refreshInterval } = useSpeedData()

const intervals = [
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
]
</script>

<template>
  <main>
    <header>
      <h1>WiFi Speed Monitor</h1>
      <div class="controls">
        <div class="auto-refresh">
          <label class="toggle">
            <input type="checkbox" v-model="autoRefresh" />
            <span class="slider"></span>
          </label>
          <span class="toggle-label">自动刷新</span>
          <div class="intervals" v-show="autoRefresh">
            <button
              v-for="opt in intervals"
              :key="opt.value"
              :class="['interval-btn', { active: refreshInterval === opt.value }]"
              @click="refreshInterval = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
        <button class="refresh" @click="refresh" :disabled="loading">
          {{ loading ? '刷新中...' : '刷新' }}
        </button>
      </div>
    </header>
    <SpeedCard
      :download="latest.download"
      :upload="latest.upload"
      :ts="latest.ts"
    />
    <SpeedChart :records="history" :loading="loading" :autoRefresh="autoRefresh" />
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
  flex-wrap: wrap;
  gap: 0.75rem;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.auto-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  inset: 0;
  background: var(--color-border);
  border-radius: 10px;
  transition: 0.2s;
}

.slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: 0.2s;
}

.toggle input:checked + .slider {
  background: hsla(160, 100%, 37%, 1);
}

.toggle input:checked + .slider::before {
  transform: translateX(16px);
}

.toggle-label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.intervals {
  display: flex;
  gap: 0.25rem;
}

.interval-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.8rem;
}

.interval-btn.active {
  background: var(--color-background-mute);
  border-color: var(--color-heading);
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

@media (max-width: 480px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }

  .controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
