"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'
import { endpoints } from "@/app/api/config"

interface ManageRolesProps {
  username: string
  onSuccess: () => void
}

export function ManageRoles({ username, onSuccess }: ManageRolesProps) {
  const [roles, setRoles] = useState<string[]>([])
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
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
        setUserRoles(userData.roles || [])
      } catch (error) {
        toast.error("Failed to load roles. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [username])

  const handleRoleChange = async (roleName: string, isChecked: boolean) => {
    setIsSubmitting(true)
    try {
      const method = isChecked ? 'POST' : 'DELETE'
      const url = `${endpoints.users}/${username}/roles${isChecked ? '' : `/${roleName}`}`
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: isChecked ? JSON.stringify({ name: roleName }) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isChecked ? 'grant' : 'revoke'} role`)
      }

      setUserRoles((prevRoles) => {
        if (isChecked) {
          return [...prevRoles, roleName]
        } else {
          return prevRoles.filter((role) => role !== roleName)
        }
      })

      toast.success(`Role ${isChecked ? 'granted' : 'revoked'} successfully`)
      onSuccess()
    } catch (error) {
      toast.error(`Failed to ${isChecked ? 'grant' : 'revoke'} role. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading roles...</div>
  }

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div key={role} className="flex items-center space-x-2">
          <Checkbox
            id={role}
            checked={userRoles.includes(role)}
            onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
            disabled={isSubmitting}
          />
          <label
            htmlFor={role}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {role}
          </label>
        </div>
      ))}
      {isSubmitting && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  )
}

