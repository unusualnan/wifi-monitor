export interface SpeedRecord {
  ts: string
  download: number
  upload: number
}

export type LatestSpeed =
  | SpeedRecord
  | { ts: null; download: null; upload: null }
