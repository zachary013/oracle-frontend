"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import PrivilegesTable from "../components/privileges-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreatePrivilegeForm } from "../components/create-privilege-form"
import { Privilege } from "@/lib/types"
import { endpoints } from "@/app/api/config"

export default function PrivilegesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [privileges, setPrivileges] = useState<Privilege[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const fetchPrivileges = async () => {
    try {
      setLoading(true)
      const response = await fetch(endpoints.privileges)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPrivileges(data)
    } catch (e) {
      console.error("Failed to fetch privileges:", e)
      setError("Failed to load privileges. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrivileges()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oracle Privileges</h1>
          <p className="text-muted-foreground">
            Manage system and object privileges
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Privilege
          </Button>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Privilege</DialogTitle>
            </DialogHeader>
            <CreatePrivilegeForm
              onSuccess={() => {
                setIsCreateDialogOpen(false)
                fetchPrivileges()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <PrivilegesTable
        privileges={privileges}
        error={error}
        loading={loading}
        setPrivileges={setPrivileges}
        setError={setError}
        setLoading={setLoading}
      />
    </div>
  )
}

