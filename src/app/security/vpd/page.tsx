'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { securityApi } from "../../api/security"
import type { VPDPolicy } from "@/lib/types"

export default function VPDPage() {
  const [policies, setPolicies] = useState<VPDPolicy[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    policyName: '',
    tableName: '',
    functionName: '',
    policyFunction: '',
    statementTypes: 'SELECT,INSERT,UPDATE,DELETE',
    active: true
  })

  useEffect(() => {
    loadPolicies()
  }, [])

  async function loadPolicies() {
    const data = await securityApi.getVPDPolicies()
    setPolicies(data)
  }

  async function handleCreatePolicy(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await securityApi.createVPDPolicy(formData)
      await loadPolicies()
      setFormData({
        policyName: '',
        tableName: '',
        functionName: '',
        policyFunction: '',
        statementTypes: 'SELECT,INSERT,UPDATE,DELETE',
        active: true
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeletePolicy(policyName: string) {
    setLoading(true)
    try {
      await securityApi.deleteVPDPolicy(policyName)
      await loadPolicies()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <form onSubmit={handleCreatePolicy} className="grid gap-4 mb-6">
        <div className="grid gap-2">
          <Label htmlFor="policyName">Policy Name</Label>
          <Input
            id="policyName"
            value={formData.policyName}
            onChange={(e) => setFormData(prev => ({ ...prev, policyName: e.target.value }))}
            required
          />
        </div>
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
          <Label htmlFor="functionName">Function Name</Label>
          <Input
            id="functionName"
            value={formData.functionName}
            onChange={(e) => setFormData(prev => ({ ...prev, functionName: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="policyFunction">Policy Function</Label>
          <Textarea
            id="policyFunction"
            value={formData.policyFunction}
            onChange={(e) => setFormData(prev => ({ ...prev, policyFunction: e.target.value }))}
            required
            className="font-mono"
            rows={4}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="statementTypes">Statement Types</Label>
          <Input
            id="statementTypes"
            value={formData.statementTypes}
            onChange={(e) => setFormData(prev => ({ ...prev, statementTypes: e.target.value }))}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked as boolean }))}
          />
          <Label htmlFor="active">Active</Label>
        </div>
        <Button type="submit" disabled={loading}>
          Create Policy
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy Name</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Function</TableHead>
            <TableHead>Statement Types</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell>{policy.policyName}</TableCell>
              <TableCell>{policy.tableName}</TableCell>
              <TableCell>{policy.functionName}</TableCell>
              <TableCell>{policy.statementTypes}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${policy.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {policy.active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                  onClick={() => handleDeletePolicy(policy.policyName)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

