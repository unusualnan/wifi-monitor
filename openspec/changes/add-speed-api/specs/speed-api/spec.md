## Purpose

为家用路由器网速监控系统提供后端 API，支持 Python 脚本批量上传测速数据，并提供最新数据和历史范围查询接口。

## ADDED Requirements

### Requirement: 批量上传网速记录

系统 SHALL 提供 HTTP POST 端点 `/api/upload`，接收批量网速记录并存入 D1 数据库。

#### Scenario: 成功上传批量记录

- **WHEN** 客户端发送 POST 请求到 `/api/upload`，Body 为 `{ "records": [{ "ts": "ISO8601", "download": number, "upload": number }, ...] }`
- **THEN** 系统将所有记录插入 `speed_log` 表，返回 `{ "ok": true, "count": N }`，HTTP 状态码 200

#### Scenario: 空记录上传

- **WHEN** 客户端发送 POST 请求到 `/api/upload`，Body 中 `records` 为空数组
- **THEN** 系统返回 `{ "ok": true, "count": 0 }`，HTTP 状态码 200

#### Scenario: 缺少 records 字段

- **WHEN** 客户端发送 POST 请求到 `/api/upload`，Body 中不包含 `records` 字段
- **THEN** 系统返回 `{ "ok": false, "error": "missing records" }`，HTTP 状态码 400

### Requirement: 查询最新网速记录

系统 SHALL 提供 HTTP GET 端点 `/api/latest`，返回最近一条网速记录。

#### Scenario: 存在历史记录

- **WHEN** 客户端发送 GET 请求到 `/api/latest`
- **THEN** 系统返回 `speed_log` 表中 `ts` 最大的一条记录，格式为 `{ "ts", "download", "upload", "device" }`，HTTP 状态码 200

#### Scenario: 无历史记录

- **WHEN** 客户端发送 GET 请求到 `/api/latest`，且 `speed_log` 表为空
- **THEN** 系统返回 `{ "ts": null, "download": null, "upload": null }`，HTTP 状态码 200

### Requirement: 按时间范围查询历史记录

系统 SHALL 提供 HTTP GET 端点 `/api/history`，支持按小时范围查询历史网速数据。

#### Scenario: 查询最近 N 小时数据

- **WHEN** 客户端发送 GET 请求到 `/api/history?hours=24`
- **THEN** 系统返回最近 24 小时内所有记录，按 `ts` 升序排列，格式为 `{ "records": [{ "ts", "download", "upload" }, ...] }`，HTTP 状态码 200

#### Scenario: hours 参数缺失

- **WHEN** 客户端发送 GET 请求到 `/api/history`，未提供 `hours` 参数
- **THEN** 系统默认查询最近 24 小时的数据

#### Scenario: hours 参数无效

- **WHEN** 客户端发送 GET 请求到 `/api/history?hours=abc`
- **THEN** 系统返回 `{ "ok": false, "error": "invalid hours parameter" }`，HTTP 状态码 400

### Requirement: D1 数据库 Schema

系统 SHALL 使用以下表结构存储网速数据：

```sql
CREATE TABLE speed_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ts        TEXT NOT NULL,
  device    TEXT NOT NULL DEFAULT 'main',
  download  REAL NOT NULL,
  upload    REAL NOT NULL
);
CREATE INDEX idx_speed_ts_device ON speed_log(ts, device);
```

#### Scenario: 插入记录时自动设置 device 默认值

- **WHEN** 插入记录未指定 `device` 字段
- **THEN** `device` 字段默认值为 `'main'`

### Requirement: CORS 支持

系统 SHALL 在 API 响应中包含 CORS 头，允许跨域请求。

#### Scenario: 浏览器跨域请求

- **WHEN** 浏览器从前端页面发起跨域 API 请求
- **THEN** 响应包含 `Access-Control-Allow-Origin: *` 头
