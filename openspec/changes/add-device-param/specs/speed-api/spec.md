# Spec Delta

## MODIFIED Requirements

### Requirement: 批量上传网速记录

系统 SHALL 提供 HTTP POST 端点 `/api/upload`，接收批量网速记录并存入 D1 数据库。

#### Scenario: 成功上传批量记录

- **WHEN** 客户端发送 POST 请求到 `/api/upload`，Body 为 `{ "records": [{ "ts": "ISO8601", "download": number, "upload": number, "device": string }, ...] }`
- **THEN** 系统将所有记录插入 `speed_log` 表（包含 `device` 字段），返回 `{ "ok": true, "count": N }`，HTTP 状态码 200

#### Scenario: 空记录上传

- **WHEN** 客户端发送 POST 请求到 `/api/upload`，Body 中 `records` 为空数组
- **THEN** 系统返回 `{ "ok": true, "count": 0 }`，HTTP 状态码 200

#### Scenario: 缺少 records 字段

- **WHEN** 客户端发送 POST 请求到 `/api/upload`，Body 中不包含 `records` 字段
- **THEN** 系统返回 `{ "ok": false, "error": "missing records" }`，HTTP 状态码 400

### Requirement: 按时间范围查询历史记录

系统 SHALL 提供 HTTP GET 端点 `/api/history`，支持按小时范围查询历史网速数据。

#### Scenario: 查询最近 N 小时数据

- **WHEN** 客户端发送 GET 请求到 `/api/history?hours=24`
- **THEN** 系统返回最近 24 小时内所有记录，按 `ts` 升序排列，格式为 `{ "records": [{ "ts", "download", "upload", "device" }, ...] }`，HTTP 状态码 200

#### Scenario: hours 参数缺失

- **WHEN** 客户端发送 GET 请求到 `/api/history`，未提供 `hours` 参数
- **THEN** 系统默认查询最近 24 小时的数据

#### Scenario: hours 参数无效

- **WHEN** 客户端发送 GET 请求到 `/api/history?hours=abc`
- **THEN** 系统返回 `{ "ok": false, "error": "invalid hours parameter" }`，HTTP 状态码 400
