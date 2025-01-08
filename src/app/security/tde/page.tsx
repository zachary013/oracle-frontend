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
import { securityApi } from "../../api/security"
import type { TDEConfig } from "@/lib/types"

export default function TDEPage() {
  const [configs, setConfigs] = useState<TDEConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    tableName: '',
    columnName: '',
    algorithm: 'AES256'
  })

  useEffect(() => {
    loadConfigurations()
  }, [])

  async function loadConfigurations() {
    setLoading(true)
    try {
      const data = await securityApi.getTDEConfigurations()
      setConfigs(data)
    } catch (error) {
      console.error("Failed to load TDE configurations:", error)
      setError("Failed to load TDE configurations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleEnableTDE(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await securityApi.enableTDE(formData.tableName, formData.columnName, formData.algorithm)
      console.log('TDE enabled successfully:', result)
      await loadConfigurations()
      setFormData({
        tableName: '',
        columnName: '',
        algorithm: 'AES256'
      })
    } catch (error) {
      console.error("Failed to enable TDE:", error)
      setError(error instanceof Error ? error.message : "Failed to enable TDE. Please check the console for details.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDisableTDE(tableName: string, columnName: string) {
    setLoading(true)
    setError(null)
    try {
      await securityApi.disableTDE(tableName, columnName)
      await loadConfigurations()
    } catch (error) {
      console.error("Failed to disable TDE:", error)
      setError("Failed to disable TDE. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">TDE Management</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleEnableTDE} className="grid gap-4 mb-6">
        <div className="grid gap-2">
          <Label htmlFor="tableName">Table Name</Label>
          <Input
            id="tableName"
            value={formData.tableName}
            onChange={(e) => setFormData(prev => ({ ...prev, tableName: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="columnName">Column Name</Label>
          <Input
            id="columnName"
            value={formData.columnName}
            onChange={(e) => setFormData(prev => ({ ...prev, columnName: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="algorithm">Encryption Algorithm</Label>
          <Select value={formData.algorithm} onValueChange={(value) => setFormData(prev => ({ ...prev, algorithm: value }))}>
            <SelectTrigger id="algorithm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AES256">AES-256</SelectItem>
              <SelectItem value="AES192">AES-192</SelectItem>
              <SelectItem value="AES128">AES-128</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enabling...' : 'Enable TDE'}
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table</TableHead>
            <TableHead>Column</TableHead>
            <TableHead>Algorithm</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.map((config) => (
            <TableRow key={config.id}>
              <TableCell>{config.tableName}</TableCell>
              <TableCell>{config.columnName}</TableCell>
              <TableCell>{config.encryptionAlgorithm}</TableCell>
              <TableCell>{new Date(config.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${config.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {config.active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading || !config.active}
                  onClick={() => handleDisableTDE(config.tableName, config.columnName)}
                >
                  {loading ? 'Disabling...' : 'Disable'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

