<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { AppSettings } from '@/shared/types'
import { DEFAULT_SETTINGS } from '@/shared/types'

const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')

const form = ref<AppSettings>({
  download_threshold_mbps: DEFAULT_SETTINGS.download_threshold_mbps,
  poll_interval: DEFAULT_SETTINGS.poll_interval,
})

onMounted(async () => {
  try {
    const res = await fetch('/api/settings')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    form.value = await res.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    form.value = await res.json()
    success.value = '保存成功'
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main>
    <header>
      <h1>设置</h1>
      <button class="back-btn" @click="router.push('/')">返回</button>
    </header>

    <div v-if="loading" class="loading">加载中...</div>

    <form v-else class="settings-form" @submit.prevent="save">
      <div class="field">
        <label for="threshold">告警阈值 (MB/s)</label>
        <input
          id="threshold"
          v-model.number="form.download_threshold_mbps"
          type="number"
          min="0"
          step="0.1"
        />
        <span class="hint">当前值: {{ form.download_threshold_mbps }} MB/s</span>
      </div>

      <div class="field">
        <label for="poll">轮询间隔 (秒)</label>
        <input
          id="poll"
          v-model.number="form.poll_interval"
          type="number"
          min="1"
          step="1"
        />
        <span class="hint">当前值: {{ form.poll_interval }} 秒</span>
      </div>

      <div v-if="error" class="message error">{{ error }}</div>
      <div v-if="success" class="message success">{{ success }}</div>

      <div class="actions">
        <button type="submit" class="save-btn" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  padding: 1.5rem;
  box-sizing: border-box;
  max-width: 480px;
  margin: 0 auto;
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

.back-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.85rem;
}

.back-btn:hover {
  background: var(--color-background-mute);
}

.loading {
  text-align: center;
  color: var(--color-text);
  opacity: 0.6;
  padding: 2rem 0;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-weight: 500;
  font-size: 0.95rem;
}

.field input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  outline: none;
}

.field input:focus {
  border-color: hsla(160, 100%, 37%, 1);
}

.hint {
  font-size: 0.8rem;
  opacity: 0.6;
}

.message {
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.message.error {
  background: hsla(0, 80%, 60%, 0.15);
  color: hsl(0, 80%, 55%);
}

.message.success {
  background: hsla(160, 100%, 37%, 0.12);
  color: hsl(160, 100%, 37%);
}

.actions {
  margin-top: 0.5rem;
}

.save-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid hsla(160, 100%, 37%, 1);
  border-radius: 6px;
  background: hsla(160, 100%, 37%, 1);
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.save-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
