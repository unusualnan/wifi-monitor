# Design

## Context

当前 upload handler 只插入 `ts`, `download`, `upload`，history handler 只查这三个字段。D1 表已有 `device` 字段（DEFAULT 'main'）。前端 `SpeedRecord` 类型和 chart 组件都不感知 device。

## Goals / Non-Goals

**Goals:**
- Upload 接口接受并存储 device
- History 接口返回 device
- Chart 按 device 分组显示多条曲线

**Non-Goals:**
- 不做 device 管理/注册功能
- 不做 device 筛选 UI（当前只有 2 个设备，全部显示）
- 不修改 latest 接口（已包含 device）

## Decisions

### Upload 请求体加 device 字段

**决策：** 在 records 的每个对象中加入 `device: string`，INSERT 时一并写入。

**替代方案：** 从请求头或 IP 推断设备 — 增加复杂度，不如下显式传参可靠。

### History 返回加 device

**决策：** SELECT 加 `device` 字段，返回给前端。

### Chart 按 device 分组生成 series

**决策：** 前端按 device 分组，每组生成两条 series（下载/上传）。x 轴使用所有时间戳的并集，缺失值用 null 填充（ECharts 自动断线）。

**替代方案：**
- 分面（每个 device 一个独立 chart）— 设备少时没必要，增加布局复杂度
- device 选择器 — 设备只有 2 个，全部显示更直观

**Series 命名：** `{device} 下载` / `{device} 上传`，例如 `Phone 下载`、`Laptop 上传`。

## Risks / Trade-offs

- **设备增多时 legend 拥挤** → 当前只有 2 个设备，可接受。未来可加 device 选择器。
- **时间戳不对齐导致断线** → 正常现象，用户可理解。可通过 DataZoom 查看细节。

## Migration Plan

1. 修改 upload handler 加 device
2. 修改 history handler 加 device
3. 更新前端类型
4. 更新 chart 组件
5. 部署

无需数据库迁移（表已有 device 字段）。

## Open Questions

- 无
