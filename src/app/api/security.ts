//src/app/api/security.ts

import { TDEConfig, VPDPolicy, AuditConfig } from "@/lib/types";

const API_BASE = 'http://localhost:8080/api/security'

export const securityApi = {
  async enableTDE(tableName: string, columnName: string, algorithm: string): Promise<TDEConfig> {
    const response = await fetch(`${API_BASE}/tde/enable?tableName=${encodeURIComponent(tableName)}&columnName=${encodeURIComponent(columnName)}&algorithm=${encodeURIComponent(algorithm)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to enable TDE: ${response.status} ${response.statusText}. ${errorText}`);
    }
    return response.json();
  },

  async disableTDE(tableName: string, columnName: string): Promise<void> {
    const response = await fetch(`${API_BASE}/tde/disable?tableName=${encodeURIComponent(tableName)}&columnName=${encodeURIComponent(columnName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to disable TDE: ${response.status} ${response.statusText}. ${errorText}`);
    }
  },

  async getTDEConfigurations(): Promise<TDEConfig[]> {
    const response = await fetch(`${API_BASE}/tde/configurations`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get TDE configurations: ${response.status} ${response.statusText}. ${errorText}`);
    }
    return response.json();
  },


  // VPD endpoints
  async createVPDPolicy(policy: Omit<VPDPolicy, 'id' | 'createdAt' | 'createdBy'>) {
    const response = await fetch(`${API_BASE}/vpd/policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(policy),
    })
    return response.json() as Promise<VPDPolicy>
  },

  async deleteVPDPolicy(policyName: string) {
    await fetch(`${API_BASE}/vpd/policies/${policyName}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  },

  async getVPDPolicies() {
    const response = await fetch(`${API_BASE}/vpd/policies`, {
      credentials: 'include',
    })
    return response.json() as Promise<VPDPolicy[]>
  },

  // Audit endpoints
  async enableAudit(config: Omit<AuditConfig, 'id' | 'createdAt' | 'createdBy'>) {
    const response = await fetch(`${API_BASE}/audit/enable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(config),
    })
    return response.json() as Promise<AuditConfig>
  },

  async disableAudit(tableName: string) {
    await fetch(`${API_BASE}/audit/disable?tableName=${tableName}`, {
      method: 'POST',
      credentials: 'include',
    })
  },

  async getAuditConfigurations() {
    const response = await fetch(`${API_BASE}/audit/configurations`, {
      credentials: 'include',
    })
    return response.json() as Promise<AuditConfig[]>
  },
}

