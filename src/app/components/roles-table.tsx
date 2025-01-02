"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Key, MoreHorizontal, Trash, AlertCircle } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import React, { Dispatch, SetStateAction } from 'react'
import { Role } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ManagePrivilegesForm } from "./manage-privileges-props"

interface RolesTableProps {
  roles: Role[]
  error: string
  loading: boolean
  setRoles: Dispatch<SetStateAction<Role[]>>
  setError: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
}

const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  error,
  loading,
  setRoles,
  setError,
  setLoading,
}) => {
  const [roleToDelete, setRoleToDelete] = React.useState<string | null>(null)
  const [roleToManage, setRoleToManage] = React.useState<Role | null>(null)

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/roles')
      if (!response.ok) throw new Error('Failed to fetch roles')
      const data = await response.json()
      setRoles(data)
    } catch (err) {
      setError('Failed to load roles. Please try again later.')
      toast.error('Failed to load roles')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/roles/${name}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete role')
      fetchRoles()
      toast.success('Role deleted successfully')
    } catch (err) {
      toast.error('Failed to delete role')
    } finally {
      setRoleToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 p-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Privileges</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.name}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description || 'No description'}</TableCell>
                <TableCell>{role.privileges?.join(", ") || 'No privileges'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setRoleToManage(role)}>
                        <Key className="mr-2 h-4 w-4" />
                        Manage Privileges
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => setRoleToDelete(role.name)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              and remove all associated privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => roleToDelete && handleDeleteRole(roleToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!roleToManage} onOpenChange={() => setRoleToManage(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Role Privileges</DialogTitle>
          </DialogHeader>
          {roleToManage && (
            <ManagePrivilegesForm
              role={roleToManage}
              onSuccess={() => {
                setRoleToManage(null)
                fetchRoles()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default RolesTable

