export interface SpeedRecord {
  ts: string
  download: number
  upload: number
  device: string
}

export type LatestSpeed =
  | SpeedRecord
  | { ts: null; download: null; upload: null }

export interface AppSettings {
  download_threshold_mbps: number
  poll_interval: number
  push_serverchan: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  download_threshold_mbps: 10,
  poll_interval: 5,
  push_serverchan: false,
}
