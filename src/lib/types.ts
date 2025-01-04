export interface User {
  id: number;
  username: string;
  defaultTablespace: string;
  temporaryTablespace: string;
  quotaLimit: string;
  accountLocked: boolean;
  passwordExpiryDate: number[];
  lastLoginDate: string | null;
  failedLoginAttempts: number;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  privileges: Privilege[];
}

export interface Privilege {
  id: number;
  name: string;
  description: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}


export interface PaginationParams {
  page: number;
  pageSize: number;
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

  export interface PrivilegeUpdate {
    name: string;        // Name of the privilege
    type: 'SYSTEM' | 'OBJECT';  // Type of privilege
    objectName?: string; // Optional object name for object privileges
    action: 'GRANT' | 'REVOKE';  // Whether we're granting or revoking
    withAdminOption?: boolean;   // Optional admin option for system privileges
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
  
  export interface TDEConfig {
    id: number
    tableName: string
    columnName: string
    encryptionAlgorithm: string
    createdAt: string
    createdBy: string
    active: boolean
  }
  
  export interface VPDPolicy {
    id: number
    policyName: string
    tableName: string
    functionName: string
    policyFunction: string
    statementTypes: string
    createdAt: string
    createdBy: string
    active: boolean
  }
  
  export interface AuditConfig {
    id: number
    tableName: string
    auditLevel: 'ALL' | 'INSERT' | 'UPDATE' | 'DELETE'
    auditSuccessful: boolean
    auditFailed: boolean
    createdAt: string
    createdBy: string
  }
  