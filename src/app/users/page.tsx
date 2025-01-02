"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import UsersTable from "../components/users-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreateUserForm } from "../components/create-user-form"
import { User } from "@/lib/types"
import { endpoints } from "../api/config"

export default function UsersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(endpoints.users)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUsers(data)
    } catch (e) {
      console.error("Failed to fetch users:", e)
      setError("Failed to load users. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oracle Users</h1>
          <p className="text-muted-foreground">
            Manage Oracle database users and their permissions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="default">
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Oracle User</DialogTitle>
              </DialogHeader>
              <CreateUserForm
                onSuccess={() => {
                  setIsCreateDialogOpen(false)
                  fetchUsers()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <UsersTable
        users={users}
        error={error}
        loading={loading}
        setUsers={setUsers}
        setError={setError}
        setLoading={setLoading}
      />
    </div>
  )
}

