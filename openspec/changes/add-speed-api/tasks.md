## 1. 基础设施配置

- [x] 1.1 在 `wrangler.jsonc` 中添加 `[[d1_databases]]` 绑定配置（binding="DB", database_id="a751a3a3-ea27-4af6-9091-892db926fd0e"），验证 `wrangler dev` 启动无报错
- [x] 1.2 创建 `schema.sql` 包含 `speed_log` 表和索引，执行 `wrangler d1 execute wifi-monitor-db --file=./schema.sql` 初始化数据库
- [x] 1.3 运行 `pnpm cf-typegen` 更新 `worker-configuration.d.ts`，验证 `Env` 类型包含 `DB` 绑定

## 2. Worker API 实现

- [x] 2.1 重构 `server/index.ts` 路由逻辑，添加 `/api/upload`、`/api/latest`、`/api/history` 路由分发，验证各路径返回正确响应
- [x] 2.2 实现 `POST /api/upload` 端点：解析 JSON body，批量插入 D1，返回 `{ ok: true, count }`，验证 curl 上传多条记录成功
- [x] 2.3 实现 `GET /api/latest` 端点：查询 `speed_log` 最新一条记录，验证返回正确格式
- [x] 2.4 实现 `GET /api/history?hours=N` 端点：按时间范围查询，验证 hours 参数校验和默认值逻辑
- [x] 2.5 添加 CORS 响应头（`Access-Control-Allow-Origin: *`），验证 OPTIONS 预检请求正常

## 3. 前端依赖和 Composable

- [x] 3.1 安装 `vue-echarts` 和 `echarts` 依赖，验证 `pnpm install` 成功
- [x] 3.2 创建 `src/composables/useSpeedData.ts`，封装 `/api/latest` 和 `/api/history` 请求，返回响应式 `{ latest, history, loading, error }`

## 4. 前端组件

- [x] 4.1 创建 `src/components/SpeedCard.vue`，展示最新下载/上传速度和采集时间，无数据时显示"暂无数据"
- [x] 4.2 创建 `src/components/SpeedChart.vue`，使用 vue-echarts 渲染双折线图（下载+上传 vs 时间轴），包含 Tooltip 交互
- [x] 4.3 更新 `src/views/HomeView.vue`，组合 SpeedCard 和 SpeedChart 组件，调用 useSpeedData 获取数据

## 5. 验证和部署

- [x] 5.1 运行 `pnpm type-check` 验证 TypeScript 无报错
- [x] 5.2 运行 `pnpm build` 验证构建成功
- [ ] 5.3 运行 `pnpm preview` 本地预览，手动测试上传和展示流程

## 6. Future Work

- [x] 6.1 移动端适配：SpeedCard 窄屏纵向排列、图表高度自适应（`min(400px, 50vw)`）、X 轴标签自适应旋转
- [ ] 6.2 实时滚动时间轴：类似 Grafana 的 streaming chart，新数据到来时图表自动向左平滑移动，而非重绘整个时间轴（需要 ECharts `appendData` 或 `dataZoom` 配合 `setOption` 动态更新，中等难度）。需要增加：开启/关闭自动刷新的开关、刷新间隔选择（如 10s/30s/60s）
