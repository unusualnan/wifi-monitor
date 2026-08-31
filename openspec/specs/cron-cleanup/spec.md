## Purpose

定期清理过期的网速记录，防止 D1 数据库无限增长。

## Requirements

### Requirement: Scheduled cleanup of expired records

The system SHALL periodically delete records from `speed_log` where `ts` is older than the configured retention period.

#### Scenario: Cron trigger fires

- **WHEN** the scheduled cron trigger executes
- **THEN** the system SHALL delete all records from `speed_log` where `ts` is before `now - RETENTION_DAYS`

### Requirement: Configurable retention period

The system SHALL support a `RETENTION_DAYS` environment variable to control how many days of data to keep.

#### Scenario: Default retention

- **WHEN** `RETENTION_DAYS` is not set
- **THEN** the system SHALL default to 30 days

#### Scenario: Custom retention

- **WHEN** `RETENTION_DAYS` is set to a positive integer
- **THEN** the system SHALL use that value as the retention period in days

### Requirement: Cleanup does not affect serving requests

The scheduled cleanup SHALL NOT block or interfere with incoming fetch requests to the Worker.

#### Scenario: Concurrent execution

- **WHEN** a cron cleanup is running and a fetch request arrives
- **THEN** the fetch request SHALL be handled normally without delay
