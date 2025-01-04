"use client"

import * as React from 'react'
import { useState, useEffect } from "react"
import { Role } from "@/lib/types"
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
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight, Loader2, Shield } from 'lucide-react'

interface ManagePrivilegesFormProps {
  role: Role
  onSuccess: () => void
}

const ITEMS_PER_PAGE = 10

const MAX_VISIBLE_PAGES = 7
const getVisiblePages = (current: number, total: number) => {
  if (total <= MAX_VISIBLE_PAGES) return Array.from({ length: total }, (_, i) => i + 1)
  
  let start = Math.max(1, current - Math.floor(MAX_VISIBLE_PAGES / 2))
  let end = start + MAX_VISIBLE_PAGES - 1
  
  if (end > total) {
    end = total
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1)
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function ManagePrivilegesForm({ role, onSuccess }: ManagePrivilegesFormProps) {
  const [privileges, setPrivileges] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrivileges, setSelectedPrivileges] = useState<Set<string>>(
    new Set(role.privileges?.map(p => p.name) || [])
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [tempSelectedPrivileges, setTempSelectedPrivileges] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchPrivileges()
  }, [])

  const fetchPrivileges = async () => {
    try {
      setLoading(true)
      const response = await fetch(endpoints.privileges)
      if (!response.ok) throw new Error("Failed to fetch privileges")
      const data = await response.json()
      setPrivileges(data)
    } catch (err) {
      setError("Failed to load privileges. Please try again.")
      toast.error("Failed to load privileges")
      setPrivileges([])
    } finally {
      setLoading(false)
    }
  }

  const handlePrivilegeToggle = (privilegeName: string) => {
    setTempSelectedPrivileges(prev => {
      const newSet = new Set(prev)
      if (newSet.has(privilegeName)) {
        newSet.delete(privilegeName)
      } else {
        newSet.add(privilegeName)
      }
      return newSet
    })
  }

  const handleGrantPrivileges = async () => {
    try {
      setLoading(true)
      const privilegesToGrant = Array.from(tempSelectedPrivileges)
      
      if (privilegesToGrant.length === 0) {
        toast.error("No privileges selected")
        return
      }

      const response = await fetch(`${endpoints.roles}/${role.name}/privileges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(privilegesToGrant),
      })

      if (!response.ok) throw new Error('Failed to grant privileges')

      setSelectedPrivileges(prev => {
        const newSet = new Set(prev)
        privilegesToGrant.forEach(priv => newSet.add(priv))
        return newSet
      })
      setTempSelectedPrivileges(new Set())
      toast.success('Privileges granted successfully')
      onSuccess()
    } catch (err) {
      toast.error(`Failed to grant privileges: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRevokePrivilege = async (privilegeName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${endpoints.roles}/${role.name}/privileges/${privilegeName}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to revoke privilege')

      setSelectedPrivileges(prev => {
        const newSet = new Set(prev)
        newSet.delete(privilegeName)
        return newSet
      })
      toast.success(`Privilege revoked successfully`)
      onSuccess()
    } catch (err) {
      toast.error(`Failed to revoke privilege: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrivileges = privileges.filter(privilege =>
    privilege.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredPrivileges.length / ITEMS_PER_PAGE)
  const paginatedPrivileges = filteredPrivileges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search privileges..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="flex-1"
        />
        {tempSelectedPrivileges.size > 0 && (
          <Button
            onClick={handleGrantPrivileges}
            disabled={loading}
            className="whitespace-nowrap"
          >
            <Shield className="mr-2 h-4 w-4" />
            Grant Selected ({tempSelectedPrivileges.size})
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[300px] rounded-md border p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-red-500">
            {error}
          </div>
        ) : paginatedPrivileges.length > 0 ? (
          <div className="space-y-2">
            {paginatedPrivileges.map((privilege) => (
              <div key={privilege} className="flex items-center space-x-2 py-2">
                {selectedPrivileges.has(privilege) ? (
                  <Checkbox
                    id={privilege}
                    checked={true}
                    onCheckedChange={() => handleRevokePrivilege(privilege)}
                  />
                ) : (
                  <Checkbox
                    id={privilege}
                    checked={tempSelectedPrivileges.has(privilege)}
                    onCheckedChange={() => handlePrivilegeToggle(privilege)}
                  />
                )}
                <label
                  htmlFor={privilege}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {privilege}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No privileges found
          </div>
        )}
      </ScrollArea>

      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center overflow-x-auto px-2">
          <div className="inline-flex items-center justify-start gap-1">
            <Pagination>
              <PaginationContent className="flex-nowrap gap-1">
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                {getVisiblePages(currentPage, totalPages).map((page) => (
                  <PaginationItem key={page}>
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  )
}

