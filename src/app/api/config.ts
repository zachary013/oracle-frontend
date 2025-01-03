export const API_BASE_URL = 'http://localhost:8080/api';

export const endpoints = {
  users: `${API_BASE_URL}/users`,
  roles: `${API_BASE_URL}/roles`,
  privileges: `${API_BASE_URL}/privileges`,
  rmanBackups:`${API_BASE_URL}/rman/backups`,
  rmanFullBackup: `${API_BASE_URL}/rman/backup/full`,
  rmanIncrementalBackup: `${API_BASE_URL}/rman/incremental-backup`,
  rmanRestore: `${API_BASE_URL}/rman/restore`,
  
};

