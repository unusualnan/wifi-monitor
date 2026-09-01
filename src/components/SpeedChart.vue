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

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: Array<{ axisValue: string; seriesName: string; value: number }>) => {
        const time = params[0]?.axisValue ?? ''
        const lines = params.map(
          (p) => `${p.seriesName}: ${p.value.toFixed(1)} Mbps`,
        )
        return `${time}<br/>${lines.join('<br/>')}`
      },
    },
    legend: {
      data: ['下载', '上传'],
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
      data: props.records.map((r) =>
        new Date(r.ts).toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      ),
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
        start: props.records.length > 20 ? Math.max(0, 100 - (20 / props.records.length) * 100) : 0,
        end: 100,
      },
      {
        type: 'slider',
        start: props.records.length > 20 ? Math.max(0, 100 - (20 / props.records.length) * 100) : 0,
        end: 100,
        height: 20,
        bottom: 0,
      },
    ],
    series: [
      {
        name: '下载',
        type: 'line',
        data: props.records.map((r) => r.download),
        smooth: true,
        lineStyle: { width: 2 },
      },
      {
        name: '上传',
        type: 'line',
        data: props.records.map((r) => r.upload),
        smooth: true,
        lineStyle: { width: 2 },
      },
    ],
  }
})

watch(
  () => props.records.length,
  () => {
    if (props.autoRefresh && !userZooming.value && chartRef.value) {
      const chart = chartRef.value
      chart.dispatchAction({
        type: 'dataZoom',
        start: props.records.length > 20 ? Math.max(0, 100 - (20 / props.records.length) * 100) : 0,
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
