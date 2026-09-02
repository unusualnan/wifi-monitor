export interface SpeedRecord {
  ts: string
  download: number
  upload: number
}

export type LatestSpeed =
  | SpeedRecord
  | { ts: null; download: null; upload: null }

export interface AppSettings {
  download_threshold_mbps: number
  poll_interval: number
}

export const DEFAULT_SETTINGS: AppSettings = {
  download_threshold_mbps: 10,
  poll_interval: 5,
}
