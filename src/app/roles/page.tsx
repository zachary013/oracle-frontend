"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import RolesTable from "../components/roles-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateRoleForm } from "../components/create-role-form"
import { Role } from "@/lib/types"
import { endpoints } from "@/app/api/config"

export default function RolesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await fetch(endpoints.roles)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setRoles(data)
    } catch (e) {
      console.error("Failed to fetch roles:", e)
      setError("Failed to load roles. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oracle Roles</h1>
          <p className="text-muted-foreground">
            Manage database roles and their associated privileges
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="default">
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <CreateRoleForm
                onSuccess={() => {
                  setIsCreateDialogOpen(false)
                  fetchRoles()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <RolesTable
        roles={roles}
        error={error}
        loading={loading}
        setRoles={setRoles}
        setError={setError}
        setLoading={setLoading}
      />
    </div>
  )
}

