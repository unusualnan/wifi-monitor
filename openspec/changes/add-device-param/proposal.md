# Proposal

## Why

当前系统无法区分不同设备的网速数据。用户有多个设备（如手机、笔记本）同时监控，需要在图表中分别展示每个设备的速度曲线，以便定位哪个设备或哪个时段出现问题。

## What Changes

- `/api/upload` 接口新增 `device` 字段（字符串），写入 D1
- `/api/history` 返回结果包含 `device` 字段
- 前端类型 `SpeedRecord` 新增 `device` 属性
- 图表按 device 分组，每个设备显示独立的下载/上传曲线（共 4 条线）
- x 轴使用所有时间戳的并集，缺失数据自动断线

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `speed-api`: upload 接口接受 device 参数，history 接口返回 device 字段
- `speed-dashboard`: 图表按 device 分组展示多条曲线

## Impact

- `server/handlers/upload.ts` — INSERT 语句加 device
- `server/handlers/history.ts` — SELECT 语句加 device
- `src/shared/types.ts` — SpeedRecord 加 device
- `src/composables/useSpeedData.ts` — 追加 history 时保留 device
- `src/components/SpeedChart.vue` — 按 device 分组生成 series
