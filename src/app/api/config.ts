// api/config.js

export const API_BASE_URL = 'http://localhost:8080/api';

export const endpoints = {
  // User Management
  users: `${API_BASE_URL}/users`,
  roles: `${API_BASE_URL}/roles`,
  privileges: `${API_BASE_URL}/privileges`,

  // RMAN (Recovery Manager) Operations
  rmanBackups: `${API_BASE_URL}/rman/backups`,
  rmanFullBackup: `${API_BASE_URL}/rman/backup/full`,
  rmanIncrementalBackup: `${API_BASE_URL}/rman/incremental-backup`,
  rmanRestore: `${API_BASE_URL}/rman/restore`,

  // Performance Metrics and Reports
  realTimeMetrics: `${API_BASE_URL}/performance/metrics`,
  ashReport: `${API_BASE_URL}/performance/ash`,
  awrReport: `${API_BASE_URL}/performance/awr`,

  // Optimisation des performances 
  slowQueries: `${API_BASE_URL}/optimization/slowQueries`,
  tuningRecommendations: `${API_BASE_URL}/optimization/optimize-query`,
  gatherTableStats: `${API_BASE_URL}/optimization/gather-stats`,
  scheduleStatsGathering: `${API_BASE_URL}/optimization/schedule-stats`,
  
  // High Availability endpoints
  haStatus: `${API_BASE_URL}/ha/status`,
  haConfig: `${API_BASE_URL}/ha/configure`,
  haSimulateFailover: `${API_BASE_URL}/ha/simulate/failover`,
  haSimulateSwitchback: `${API_BASE_URL}/ha/simulate/switchback`,
  haReport: `${API_BASE_URL}/ha/report`,

};
