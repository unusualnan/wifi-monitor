CREATE TABLE IF NOT EXISTS speed_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ts        TEXT NOT NULL,
  device    TEXT NOT NULL DEFAULT 'main',
  download  REAL NOT NULL,
  upload    REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_speed_ts_device ON speed_log(ts, device);
