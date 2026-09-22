<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { SpeedRecord } from '@/shared/types'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent])

const props = defineProps<{
  records: SpeedRecord[]
  loading: boolean
  autoRefresh: boolean
}>()

const chartRef = ref<InstanceType<typeof VChart> | null>(null)
const userZooming = ref(false)

const option = computed(() => {
  if (props.records.length === 0) {
    return {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: { color: '#999' },
      },
    }
  }

  const devices = [...new Set(props.records.map((r) => r.device))].sort()
  const allTimestamps = [...new Set(props.records.map((r) => r.ts))].sort()
  const timeLabels = allTimestamps.map((ts) =>
    new Date(ts).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  )

  const deviceRecords = new Map<string, Map<string, { download: number; upload: number }>>()
  for (const device of devices) {
    deviceRecords.set(device, new Map())
  }
  for (const r of props.records) {
    deviceRecords.get(r.device)?.set(r.ts, { download: r.download, upload: r.upload })
  }

  const series: Array<{ name: string; type: string; data: (number | null)[]; smooth: boolean; lineStyle: { width: number } }> = []
  for (const device of devices) {
    const tsMap = deviceRecords.get(device)!
    series.push({
      name: `${device} 下载`,
      type: 'line',
      data: allTimestamps.map((ts) => tsMap.get(ts)?.download ?? null),
      smooth: true,
      lineStyle: { width: 2 },
    })
    series.push({
      name: `${device} 上传`,
      type: 'line',
      data: allTimestamps.map((ts) => tsMap.get(ts)?.upload ?? null),
      smooth: true,
      lineStyle: { width: 2 },
    })
  }

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: Array<{ axisValue: string; seriesName: string; value: number }>) => {
        const time = params[0]?.axisValue ?? ''
        const lines = params
          .filter((p) => p.value != null)
          .map((p) => `${p.seriesName}: ${p.value.toFixed(2)} Mbps`)
        return `${time}<br/>${lines.join('<br/>')}`
      },
    },
    legend: {
      data: series.map((s) => s.name),
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timeLabels,
      axisLabel: {
        rotate: 30,
        fontSize: 10,
        hideOverlap: true,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Mbps',
    },
    dataZoom: [
      {
        type: 'inside',
        start: allTimestamps.length > 20 ? Math.max(0, 100 - (20 / allTimestamps.length) * 100) : 0,
        end: 100,
      },
      {
        type: 'slider',
        start: allTimestamps.length > 20 ? Math.max(0, 100 - (20 / allTimestamps.length) * 100) : 0,
        end: 100,
        height: 20,
        bottom: 0,
      },
    ],
    series,
  }
})

watch(
  () => props.records.length,
  () => {
    if (props.autoRefresh && !userZooming.value && chartRef.value) {
      const timestampCount = new Set(props.records.map((r) => r.ts)).size
      const chart = chartRef.value
      chart.dispatchAction({
        type: 'dataZoom',
        start: timestampCount > 20 ? Math.max(0, 100 - (20 / timestampCount) * 100) : 0,
        end: 100,
      })
    }
  },
)

function onDataZoom() {
  userZooming.value = true
}

function onDataZoomEnd() {
  setTimeout(() => {
    userZooming.value = false
  }, 3000)
}
</script>

<template>
  <div class="speed-chart">
    <VChart
      v-if="records.length > 0 || loading"
      ref="chartRef"
      :option="option"
      :loading="loading"
      autoresize
      class="chart"
      @datazoom="onDataZoom"
      @datazoomend="onDataZoomEnd"
    />
    <div v-else class="empty">暂无数据</div>
  </div>
</template>

<style scoped>
.speed-chart {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 1rem;
}

.chart {
  height: 400px;
}

@media (max-width: 480px) {
  .chart {
    height: min(400px, 50vw);
  }
}

.empty {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
}
</style>
