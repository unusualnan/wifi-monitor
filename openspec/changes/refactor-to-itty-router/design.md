## Context

`server/index.ts` 当前使用 if/else 链路由请求到 handler 函数。handler 本身已独立提取，路由逻辑约 20 行。需要引入 itty-router 替代手动路由。

## Goals / Non-Goals

**Goals:**

- 用声明式路由注册替代 if/else 条件判断
- 集中 CORS 和错误处理
- 保持 API 行为完全不变

**Non-Goals:**

- 不改 handler 函数签名（保持 `(request, db)` 模式）
- 不引入额外中间件（认证、限流等暂不需要）
- 不改 scheduled handler

## Decisions

### 1. 选择 Router 而非 IttyRouter 或 AutoRouter

**选择**: `Router` (~530 bytes)

**理由**:
- 比 IttyRouter 多 `catch` 和 `before` 阶段，适合集中错误处理和 CORS
- 比 AutoRouter 小一半，不需要它的 `format: json` 默认行为（会干扰自定义响应）
- 当前 3 个路由，Router 的能力恰好匹配

### 2. CORS 中间件替代手动头

**选择**: itty-router 内置 `cors()` 中间件

**理由**:
- 当前手动维护 `corsHeaders` 对象和 OPTIONS 处理
- `cors()` 自动处理 preflight，代码更简洁

### 3. 保持 handler 签名不变

**选择**: handler 继续接收 `(request, db)` 而非 itty 的解构参数

**理由**:
- 减少改动量，handler 逻辑零变化
- itty-router 支持通过 `withCloudflare` 传递 env，但对 3 个路由来说没必要

## Risks / Trade-offs

- **[itty-router 版本兼容]** → itty-router v5 需要 Node >=18，项目已满足。确认最新稳定版
- **[Cloudflare Workers 兼容性]** → itty-router 原生支持 Workers，无风险
- **[包体积增加]** → ~530 bytes gzip 后约 300B，可忽略

## Migration Plan

1. `pnpm add itty-router`
2. 重写 `server/index.ts` 路由部分
3. `pnpm type-check` + `pnpm build` 验证
4. `pnpm preview` 手动测试 API 行为不变

## Open Questions

（无）
