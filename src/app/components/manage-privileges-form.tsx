"use client"

import * as React from 'react'
import { useState, useEffect } from "react"
import { Role, Privilege, PaginatedResponse, PrivilegeUpdate } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { endpoints } from "@/app/api/config"
import { toast } from "sonner"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2 } from 'lucide-react'

interface ManagePrivilegesFormProps {
  role: Role
  onSuccess: () => void
}

export function ManagePrivilegesForm({ role, onSuccess }: ManagePrivilegesFormProps) {
  const [systemPrivileges, setSystemPrivileges] = useState<string[]>([])
  const [objectPrivileges, setObjectPrivileges] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrivileges, setSelectedPrivileges] = useState<Set<string>>(
    new Set(role.privileges.map(p => p.name))
  )

  useEffect(() => {
    fetchPrivileges()
  }, [])

  const fetchPrivileges = async () => {
    try {
      setLoading(true)
      
      // Fetch system privileges
      const systemResponse = await fetch(`${endpoints.privileges}/system/${role.name}`)
      if (!systemResponse.ok) throw new Error("Failed to fetch system privileges")
      const systemData = await systemResponse.json()
      setSystemPrivileges(systemData)

      // Fetch object privileges
      const objectResponse = await fetch(`${endpoints.privileges}/object/${role.name}`)
      if (!objectResponse.ok) throw new Error("Failed to fetch object privileges")
      const objectData = await objectResponse.json()
      setObjectPrivileges(objectData)

    } catch (err) {
      setError("Failed to load privileges. Please try again.")
      toast.error("Failed to load privileges")
    } finally {
      setLoading(false)
    }
  }

  const handlePrivilegeToggle = async (privilegeName: string, type: 'SYSTEM' | 'OBJECT', objectName?: string) => {
    try {
      setLoading(true)
      
      const isCurrentlyGranted = selectedPrivileges.has(privilegeName)
      const action: PrivilegeUpdate = {
        name: privilegeName,
        type,
        objectName,
        action: isCurrentlyGranted ? 'REVOKE' : 'GRANT',
        withAdminOption: false // You might want to make this configurable
      }

      const endpoint = action.action === 'GRANT' 
        ? (type === 'SYSTEM' ? `${endpoints.privileges}/grant/system` : `${endpoints.privileges}/grant/object`)
        : (type === 'SYSTEM' ? `${endpoints.privileges}/revoke/system` : `${endpoints.privileges}/revoke/object`)

      const params = new URLSearchParams({
        privilegeName: action.name,
        userName: role.name,
        ...(action.withAdminOption && { withAdminOption: 'true' }),
        ...(action.objectName && { objectName: action.objectName })
      })

      const response = await fetch(`${endpoint}?${params}`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error(`Failed to ${action.action.toLowerCase()} privilege`)

      setSelectedPrivileges(prev => {
        const newSet = new Set(prev)
        if (isCurrentlyGranted) {
          newSet.delete(privilegeName)
        } else {
          newSet.add(privilegeName)
        }
        return newSet
      })

      toast.success(`Privilege ${action.action.toLowerCase()}ed successfully`)
      
    } catch (err) {
      toast.error(`Failed to update privilege: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredSystemPrivileges = systemPrivileges.filter(priv => 
    priv.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredObjectPrivileges = objectPrivileges.filter(priv => 
    priv.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search privileges..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      
      <ScrollArea className="h-[300px] rounded-md border p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">System Privileges</h3>
              {filteredSystemPrivileges.length === 0 ? (
                <p className="text-sm text-muted-foreground">No system privileges found</p>
              ) : (
                filteredSystemPrivileges.map((privilege) => (
                  <div key={privilege} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={`system-${privilege}`}
                      checked={selectedPrivileges.has(privilege)}
                      onCheckedChange={() => handlePrivilegeToggle(privilege, 'SYSTEM')}
                    />
                    <label
                      htmlFor={`system-${privilege}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {privilege}
                    </label>
                  </div>
                ))
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Object Privileges</h3>
              {filteredObjectPrivileges.length === 0 ? (
                <p className="text-sm text-muted-foreground">No object privileges found</p>
              ) : (
                filteredObjectPrivileges.map((privilege) => (
                  <div key={privilege} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={`object-${privilege}`}
                      checked={selectedPrivileges.has(privilege)}
                      onCheckedChange={() => handlePrivilegeToggle(privilege, 'OBJECT')}
                    />
                    <label
                      htmlFor={`object-${privilege}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {privilege}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}