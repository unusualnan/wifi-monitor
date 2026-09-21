# Tasks

## 1. 后端 API 修改

- [x] 1.1 修改 `server/handlers/upload.ts`，INSERT 语句加入 `device` 字段，验证上传接口正常写入 device
- [x] 1.2 修改 `server/handlers/history.ts`，SELECT 语句加入 `device` 字段，验证返回结果包含 device

## 2. 前端类型更新

- [x] 2.1 修改 `src/shared/types.ts`，`SpeedRecord` 接口添加 `device: string` 属性

## 3. 前端数据层

- [x] 3.1 修改 `src/composables/useSpeedData.ts`，`fetchLatest` 追加 history 时保留 device 字段

## 4. 图表组件

- [x] 4.1 修改 `src/components/SpeedChart.vue`，按 device 分组生成 series，每个设备显示下载/上传两条曲线
