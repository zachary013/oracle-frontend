"use client"

import * as React from 'react'
import { useState, useEffect } from "react"
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

interface ManageRolesProps {
  username: string
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

export function ManageRoles({ username, onSuccess }: ManageRolesProps) {
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [userRoles, setUserRoles] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [tempSelectedRoles, setTempSelectedRoles] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchRolesAndUserData()
  }, [username])

  const fetchRolesAndUserData = async () => {
    try {
      setLoading(true)
      const [rolesResponse, userResponse] = await Promise.all([
        fetch(endpoints.roles),
        fetch(`${endpoints.users}/${username}`)
      ])
      
      if (!rolesResponse.ok || !userResponse.ok) {
        throw new Error("Failed to fetch roles or user data")
      }

      const rolesData = await rolesResponse.json()
      const userData = await userResponse.json()

      setRoles(rolesData.map((role: any) => role.name))
      setUserRoles(new Set(userData.roles.map((role: any) => role.name)))
    } catch (err) {
      setError("Failed to load roles. Please try again.")
      toast.error("Failed to load roles")
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  const handleRoleToggle = (roleName: string) => {
    setTempSelectedRoles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(roleName)) {
        newSet.delete(roleName)
      } else {
        newSet.add(roleName)
      }
      return newSet
    })
  }

  const handleGrantRoles = async () => {
    try {
      setLoading(true)
      const rolesToGrant = Array.from(tempSelectedRoles)
      
      if (rolesToGrant.length === 0) {
        toast.error("No roles selected")
        return
      }

      const response = await fetch(`${endpoints.users}/${username}/roles/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rolesToGrant.map(role => ({ name: role }))),
      })

      if (!response.ok) throw new Error('Failed to grant roles')

      setUserRoles(prev => {
        const newSet = new Set(prev)
        rolesToGrant.forEach(role => newSet.add(role))
        return newSet
      })
      setTempSelectedRoles(new Set())
      toast.success('Roles granted successfully')
      onSuccess()
    } catch (err) {
      toast.error(`Failed to grant roles: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeRole = async (roleName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${endpoints.users}/${username}/roles/${roleName}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to revoke role')

      setUserRoles(prev => {
        const newSet = new Set(prev)
        newSet.delete(roleName)
        return newSet
      })
      toast.success(`Role revoked successfully`)
      onSuccess()
    } catch (err) {
      toast.error(`Failed to revoke role: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredRoles = roles.filter(role =>
    role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE)
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="flex-1"
        />
        {tempSelectedRoles.size > 0 && (
          <Button
            onClick={handleGrantRoles}
            disabled={loading}
            className="whitespace-nowrap"
          >
            <Shield className="mr-2 h-4 w-4" />
            Grant Selected ({tempSelectedRoles.size})
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
        ) : paginatedRoles.length > 0 ? (
          <div className="space-y-2">
            {paginatedRoles.map((role) => (
              <div key={role} className="flex items-center space-x-2 py-2">
                {userRoles.has(role) ? (
                  <Checkbox
                    id={role}
                    checked={true}
                    onCheckedChange={() => handleRevokeRole(role)}
                  />
                ) : (
                  <Checkbox
                    id={role}
                    checked={tempSelectedRoles.has(role)}
                    onCheckedChange={() => handleRoleToggle(role)}
                  />
                )}
                <label
                  htmlFor={role}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No roles found
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

