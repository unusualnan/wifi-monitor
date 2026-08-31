## Context

当前项目是一个部署在 Cloudflare Workers 上的 Vue 3 + Vite 应用。`server/index.ts` 是 Worker 入口，目前只有一个 stub API。需要扩展为完整的网速数据后端，并在前端添加数据可视化。

D1 数据库已创建，ID: `a751a3a3-ea27-4af6-9091-892db926fd0e`。

## Goals / Non-Goals

**Goals:**

- Worker 能接收 Python 脚本的批量测速数据并写入 D1
- 前端能展示实时速度和历史趋势图
- 部署后 Python 脚本可直接调用 API 上传数据

**Non-Goals:**

- 用户认证/鉴权（内网使用，不需要）
- 多设备支持（schema 预留 device 字段，但前端只展示单一设备）
- 数据导出/下载功能
- 告警/通知功能

## Decisions

### 1. 选择 D1 而非 KV

**选择**: Cloudflare D1 (SQLite)

**理由**:
- 历史趋势图需要按时间范围查询 (`WHERE ts BETWEEN ...`)
- 未来可能需要聚合查询（平均速度、峰值等）
- KV 只能按 key 精确查询，无法做范围查询

**替代方案**: KV 按日期分 key (`speed:2026-08-27`)，但跨天查询和聚合很不方便

### 2. Server 路由结构

**选择**: 在 `server/index.ts` 中用简单的 if/else 路由，不引入框架

**理由**:
- 只有 3 个端点，路由逻辑简单
- 避免引入额外依赖（如 itty-router）
- Worker 环境轻量优先

**替代方案**: 使用 itty-router 或 hono，但对 3 个端点来说是过度工程

### 3. 前端图表库

**选择**: vue-echarts + echarts

**理由**:
- ECharts 中文生态好，文档齐全
- 内置 Tooltip、图例、动画
- 对时序折线图支持完善

**替代方案**: Chart.js（更轻量但功能少）、D3（太底层）

### 4. 前端数据获取

**选择**: 在 `useSpeedData` composable 中使用原生 `fetch` + `setInterval`

**理由**:
- 不需要引入 axios 或 SWR/TanStack Query
- 轮询逻辑简单，30 秒一次足够
- 保持依赖最小化

### 5. 数据库初始化

**选择**: 提供 SQL 初始化脚本，通过 `wrangler d1 execute` 手动运行

**理由**:
- 单次操作，不需要迁移工具
- D1 支持直接执行 SQL 文件

**执行命令**:
```bash
wrangler d1 execute wifi-monitor-db --file=./schema.sql
```

## Risks / Trade-offs

- **[D1 写入延迟]** → D1 是最终一致性，写入后立即查询可能读不到。对于网速监控场景可接受，前端有 30 秒轮询间隔
- **[无认证]** → API 暴露在公网上，任何人可上传数据。内网使用可接受，后续可加 API Key
- **[ECharts 包体积]** → echarts 完整包约 1MB，但 Vite 会 tree-shake。如果体积敏感可用 echarts/core 按需引入
- **[单设备限制]** → 前端只展示单一设备，但 schema 已预留 device 字段，后续扩展成本低

## Migration Plan

1. `wrangler.jsonc` 添加 D1 绑定
2. 创建 `schema.sql` 并执行 `wrangler d1 execute`
3. 实现 Worker API 端点
4. 前端安装 vue-echarts 并创建组件
5. `pnpm build && pnpm deploy` 部署

## Open Questions

（无）
