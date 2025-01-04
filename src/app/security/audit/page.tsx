'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { securityApi } from "../../api/security"

interface FormData {
  tableName: string;
  auditLevel: 'ALL' | 'INSERT' | 'UPDATE' | 'DELETE';
  auditSuccessful: boolean;
  auditFailed: boolean;
}

interface AuditConfig {
  id: number;
  tableName: string;
  auditLevel: 'ALL' | 'INSERT' | 'UPDATE' | 'DELETE';
  auditSuccessful: boolean;
  auditFailed: boolean;
  createdAt: string;
  createdBy: string;
}

export default function AuditPage() {
  const [configs, setConfigs] = useState<AuditConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    tableName: '',
    auditLevel: 'ALL',
    auditSuccessful: true,
    auditFailed: true
  })

  useEffect(() => {
    loadConfigurations()
  }, [])

  async function loadConfigurations() {
    const data = await securityApi.getAuditConfigurations()
    setConfigs(data)
  }

  async function handleEnableAudit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await securityApi.enableAudit(formData)
      await loadConfigurations()
      setFormData({
        tableName: '',
        auditLevel: 'ALL',
        auditSuccessful: true,
        auditFailed: true
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDisableAudit(tableName: string) {
    setLoading(true)
    try {
      await securityApi.disableAudit(tableName)
      await loadConfigurations()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <form onSubmit={handleEnableAudit} className="grid gap-4 mb-6">
        <div className="grid gap-2">
          <Label htmlFor="tableName">Table Name</Label>
          <Input
            id="tableName"
            value={formData.tableName}
            onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="auditLevel">Audit Level</Label>
          <Select
            value={formData.auditLevel}
            onValueChange={(value: 'ALL' | 'INSERT' | 'UPDATE' | 'DELETE') =>
              setFormData({ ...formData, auditLevel: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Operations</SelectItem>
              <SelectItem value="INSERT">Insert Only</SelectItem>
              <SelectItem value="UPDATE">Update Only</SelectItem>
              <SelectItem value="DELETE">Delete Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auditSuccessful"
              checked={formData.auditSuccessful}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, auditSuccessful: checked as boolean })
              }
            />
            <Label htmlFor="auditSuccessful">Audit Successful Operations</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auditFailed"
              checked={formData.auditFailed}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, auditFailed: checked as boolean })
              }
            />
            <Label htmlFor="auditFailed">Audit Failed Operations</Label>
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          Enable Auditing
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table</TableHead>
            <TableHead>Audit Level</TableHead>
            <TableHead>Successful</TableHead>
            <TableHead>Failed</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.map((config) => (
            <TableRow key={config.id}>
              <TableCell>{config.tableName}</TableCell>
              <TableCell>{config.auditLevel}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${config.auditSuccessful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {config.auditSuccessful ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${config.auditFailed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {config.auditFailed ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>{new Date(config.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                  onClick={() => handleDisableAudit(config.tableName)}
                >
                  Disable
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}