<script setup lang="ts">
defineProps<{
  download: number | null
  upload: number | null
  ts: string | null
}>()

function formatTime(iso: string | null): string {
  if (!iso) return '--'
  return new Date(iso).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>

<template>
  <div class="speed-card">
    <template v-if="download !== null && upload !== null">
      <div class="speed-row">
        <div class="speed-item">
          <span class="label">↓ 下载</span>
          <span class="value">{{ download.toFixed(1) }}</span>
          <span class="unit">Mbps</span>
        </div>
        <div class="speed-item">
          <span class="label">↑ 上传</span>
          <span class="value">{{ upload.toFixed(1) }}</span>
          <span class="unit">Mbps</span>
        </div>
      </div>
      <div class="time">更新于 {{ formatTime(ts) }}</div>
    </template>
    <div v-else class="empty">暂无数据</div>
  </div>
</template>

<style scoped>
.speed-card {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.speed-row {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.speed-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-heading);
}

.unit {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.time {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-light);
}

.empty {
  padding: 2rem;
  color: var(--color-text-light);
}
</style>
