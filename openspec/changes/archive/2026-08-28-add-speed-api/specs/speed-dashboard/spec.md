## Purpose

提供 Vue 3 前端仪表盘，实时展示最新网速数据，并通过折线图展示历史趋势，帮助用户监控家庭网络质量。

## ADDED Requirements

### Requirement: 实时速度卡片

系统 SHALL 在首页展示一个速度卡片组件，显示最新的网速数据。

#### Scenario: 显示最新速度

- **WHEN** 用户访问首页
- **THEN** 页面显示一个卡片，包含：下载速度（Mbps）、上传速度（Mbps）、数据采集时间

#### Scenario: 自动刷新

- **WHEN** 卡片已显示数据
- **THEN** 每 30 秒自动请求 `/api/latest` 更新数据

#### Scenario: 无数据状态

- **WHEN** 后端无任何网速记录
- **THEN** 卡片显示占位文本"暂无数据"

### Requirement: 历史趋势图

系统 SHALL 在首页展示一个折线图，显示历史网速趋势。

#### Scenario: 显示双折线图

- **WHEN** 用户访问首页
- **THEN** 页面显示一个折线图，X 轴为时间，Y 轴为速度（Mbps），包含下载和上传两条折线

#### Scenario: 默认显示最近 24 小时

- **WHEN** 图表首次加载
- **THEN** 查询并展示最近 24 小时的网速数据

#### Scenario: 空数据状态

- **WHEN** 查询范围内无数据
- **THEN** 图表显示"暂无数据"提示

### Requirement: Vue ECharts 集成

系统 SHALL 使用 vue-echarts 库渲染图表。

#### Scenario: 图表交互

- **WHEN** 用户悬停在图表数据点上
- **THEN** 显示 Tooltip，包含具体时间和速度值

### Requirement: Composable 数据层

系统 SHALL 提供 `useSpeedData` composable，封装 API 请求逻辑。

#### Scenario: 提供响应式数据

- **WHEN** 组件调用 `useSpeedData()`
- **THEN** 返回 `{ latest, history, loading, error }` 响应式对象

#### Scenario: 错误处理

- **WHEN** API 请求失败
- **THEN** `error` 对象包含错误信息，`loading` 为 false
