## Why

家用路由器设备的网速数据由 Python 脚本定时采集，需要一个后端 API 接收并存储这些数据，同时通过 Vue 3 前端实时展示最新速度和历史趋势图，帮助监控网络质量。

## What Changes

- 新增 Cloudflare Worker API 端点，支持批量上传网速记录（POST /api/upload）
- 新增查询端点：获取最新一条记录（GET /api/latest）、按时间范围查询历史（GET /api/history）
- 集成 Cloudflare D1 数据库，存储网速时序数据
- 新增 Vue 3 前端组件：实时速度卡片 + vue-echarts 历史趋势折线图
- 新增 `vue-echarts` 和 `echarts` 依赖
- 新增 D1 数据库绑定配置（wrangler.jsonc）

## Capabilities

### New Capabilities

- `speed-api`: Worker 后端 API，包含数据上传、最新查询、历史范围查询三个端点，以及 D1 数据库 schema 和操作
- `speed-dashboard`: Vue 3 前端仪表盘，包含实时速度卡片和历史趋势图组件

### Modified Capabilities

（无）

## Impact

- **server/index.ts**: 需要重构路由逻辑，新增多个 API 端点
- **wrangler.jsonc**: 新增 `[[d1_databases]]` 绑定配置
- **package.json**: 新增 vue-echarts、echarts 依赖
- **src/**: 新增组件、composables、路由相关代码
- **部署**: 需要 `wrangler d1 execute` 初始化数据库表
