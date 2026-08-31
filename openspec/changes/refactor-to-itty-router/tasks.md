## 1. 依赖安装

- [x] 1.1 安装 `itty-router` 依赖，验证 `pnpm install` 成功

## 2. 路由重构

- [x] 2.1 重写 `server/index.ts`：导入 itty-router，用 `Router` 注册路由替代 if/else，验证 `pnpm type-check` 通过
- [x] 2.2 用 `cors()` 中间件替代手动 CORS 头处理，验证 OPTIONS 预检请求正常
- [x] 2.3 添加 `catch` 阶段集中错误处理，验证 handler 抛异常时返回 500 而非崩溃

## 3. 验证

- [x] 3.1 `pnpm build` 构建成功
- [ ] 3.2 `pnpm preview` 手动测试三个 API 端点行为不变
