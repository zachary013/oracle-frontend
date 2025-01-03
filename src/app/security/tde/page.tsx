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
  const [tableName, setTableName] = useState('')
  const [columnName, setColumnName] = useState('')
  const [algorithm, setAlgorithm] = useState('AES256')

  useEffect(() => {
    loadConfigurations()
  }, [])

  async function loadConfigurations() {
    const data = await securityApi.getTDEConfigurations()
    setConfigs(data)
  }

  async function handleEnableTDE(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await securityApi.enableTDE(tableName, columnName, algorithm)
      await loadConfigurations()
      setTableName('')
      setColumnName('')
      setAlgorithm('AES256')
    } finally {
      setLoading(false)
    }
  }

  async function handleDisableTDE(tableName: string, columnName: string) {
    setLoading(true)
    try {
      await securityApi.disableTDE(tableName, columnName)
      await loadConfigurations()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <form onSubmit={handleEnableTDE} className="grid gap-4 mb-6">
        <div className="grid gap-2">
          <Label htmlFor="tableName">Table Name</Label>
          <Input
            id="tableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="columnName">Column Name</Label>
          <Input
            id="columnName"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="algorithm">Encryption Algorithm</Label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger>
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
          Enable TDE
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

