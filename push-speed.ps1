# 配置请求目标地址和 Auth Token（如有）
$uri = "https://unusualnan.top/api/upload"

Write-Host "开始每 5 秒向 $uri 推送模拟网速数据... (按 Ctrl+C 停止)" -ForegroundColor Green

while ($true) {
    # 1. 获取当前 UTC 时间 (ISO 8601 格式，如 2026-08-28T05:30:00Z)
    $timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

    # 2. 生成随机网速数据 (下载 80~100 Mbps，上传 30~50 Mbps，保留 1 位小数)
    $download = [math]::Round((Get-Random -Minimum 80.0 -Maximum 100.0), 1)
    $upload   = [math]::Round((Get-Random -Minimum 30.0 -Maximum 50.0), 1)

    # 3. 构建 Payload 对象并转为 JSON 格式
    $payload = @{
        records = @(
            @{
                ts       = $timestamp
                download = $download
                upload   = $upload
            }
        )
    } | ConvertTo-Json -Compress

    try {
        # 4. 发送 POST 请求
        $response = Invoke-WebRequest -Uri $uri -Method POST -ContentType "application/json" -Body $payload -UseBasicParsing
        
        Write-Host "[$timestamp] 推送成功! 下载: ${download} Mbps, 上传: ${upload} Mbps | 响应状态: $($response.StatusCode)" -ForegroundColor Cyan
    }
    catch {
        Write-Host "[$timestamp] 推送失败: $_" -ForegroundColor Red
    }

    # 5. 等待 5 秒进入下一次循环
    Start-Sleep -Seconds 5
}