  export interface User {
    username: string;
    defaultTablespace: string;
    temporaryTablespace: string;
    status: 'LOCKED' | 'UNLOCKED';
    roles: string[];
    created_at?: string;
    last_login?: string;
  }
  
  
  export interface Role {
    name: string;
    privileges: string[];
    description?: String;
  }
  
  export interface Privilege {
    name: string;
    type: 'SYSTEM' | 'OBJECT';
    description?: string;
  }
  
  export interface UserDTO {
    username: string;
    password: string;
    roles?: string[];
  }
  
  export interface RoleDTO {
    name: string;
    privileges?: string[];
  }
  
  export interface PrivilegeDTO {
    name: string;
    type: 'SYSTEM' | 'OBJECT';
    description?: string;
  }

  export interface BackupHistory {
    id: number
    type: string
    status: string
    timestamp: string
    details: string
  }

  export interface PerformanceMetrics {
    cpuUsagePercent: number
    memoryUsageMB: number
    pgaUsageMB: number
    bufferCacheHitRatio: number
    ioOperationsPerSecond: number
    timestamp: string
  }
  
  export interface AWRReport {
    SNAP_ID: number
    BEGIN_INTERVAL_TIME: string
    END_INTERVAL_TIME: string
    CPU_USAGE_PERCENT: number
    MEMORY_USAGE_MB: number
    IO_REQUESTS_PER_SEC: number
  }
  
  export interface ASHReport {
    SESSION_ID: number
    SQL_ID: string
    EVENT: string
    WAIT_CLASS: string
    SESSION_STATE: string
    TIME_WAITED: number
  }
  
  