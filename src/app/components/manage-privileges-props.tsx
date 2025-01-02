"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'
import { Role } from "@/lib/types"

interface ManagePrivilegesFormProps {
  role: Role
  onSuccess: () => void
}

export function ManagePrivilegesForm({ role, onSuccess }: ManagePrivilegesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availablePrivileges, setAvailablePrivileges] = useState<string[]>([])
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>(role.privileges || [])

  useEffect(() => {
    async function fetchAvailablePrivileges() {
      try {
        const response = await fetch('http://localhost:8080/api/roles/available-privileges')
        if (!response.ok) throw new Error('Failed to fetch privileges')
        const data = await response.json()
        setAvailablePrivileges(data)
      } catch (err) {
        toast.error('Failed to load available privileges')
      }
    }

    fetchAvailablePrivileges()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const response = await fetch(`http://localhost:8080/api/roles/${role.name}/privileges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPrivileges),
      })

      if (!response.ok) {
        throw new Error("Failed to update privileges")
      }

      toast.success("Privileges updated successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to update privileges. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {availablePrivileges.map((privilege) => (
            <div key={privilege} className="flex items-center space-x-2">
              <Checkbox
                id={privilege}
                checked={selectedPrivileges.includes(privilege)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPrivileges([...selectedPrivileges, privilege])
                  } else {
                    setSelectedPrivileges(selectedPrivileges.filter((p) => p !== privilege))
                  }
                }}
              />
              <label
                htmlFor={privilege}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {privilege}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  )
}

