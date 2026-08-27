<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

interface SpeedRecord {
  ts: string
  download: number
  upload: number
}

const props = defineProps<{
  records: SpeedRecord[]
  loading: boolean
}>()

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
      bottom: '3%',
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
      },
    },
    yAxis: {
      type: 'value',
      name: 'Mbps',
    },
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
</script>

<template>
  <div class="speed-chart">
    <VChart
      v-if="records.length > 0 || loading"
      :option="option"
      :loading="loading"
      autoresize
      style="height: 400px"
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

.empty {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
}
</style>
