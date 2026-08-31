## Why

当前 `server/index.ts` 使用 if/else 手动路由，随着 API 端点增长（已有 3 个 + 预留扩展），路由逻辑变得冗长且缺乏集中错误处理。引入 itty-router 可以用声明式路由注册替代条件判断，并获得中间件和错误处理能力。

## What Changes

- 新增 `itty-router` 依赖
- 重构 `server/index.ts` 路由逻辑：if/else → `Router` 声明式注册
- CORS 处理：手动设置头 → itty-router `cors()` 中间件
- 错误处理：分散在各 handler → 集中 `catch` 阶段
- **不改变任何 API 行为**：端点、请求/响应格式、状态码均不变

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

（无 — 纯实现重构，不改变可观测行为）

## Impact

- `server/index.ts`：路由逻辑重写
- `package.json`：新增 `itty-router` 依赖
- Worker API 行为：无变化
