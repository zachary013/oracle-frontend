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
import { MoreHorizontal, Trash, AlertCircle } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import React, { Dispatch, SetStateAction } from 'react'
import { Privilege } from "@/lib/types"
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

interface PrivilegesTableProps {
  privileges: Privilege[]
  error: string
  loading: boolean
  setPrivileges: Dispatch<SetStateAction<Privilege[]>>
  setError: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
}

const PrivilegesTable: React.FC<PrivilegesTableProps> = ({
  privileges,
  error,
  loading,
  setPrivileges,
  setError,
  setLoading,
}) => {
  const [privilegeToDelete, setPrivilegeToDelete] = React.useState<string | null>(null)

  const fetchPrivileges = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/privileges')
      if (!response.ok) throw new Error('Failed to fetch privileges')
      const data = await response.json()
      setPrivileges(data)
    } catch (err) {
      setError('Failed to load privileges. Please try again later.')
      toast.error('Failed to load privileges')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePrivilege = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/privileges/${name}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete privilege')
      fetchPrivileges()
      toast.success('Privilege deleted successfully')
    } catch (err) {
      toast.error('Failed to delete privilege')
    } finally {
      setPrivilegeToDelete(null)
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
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {privileges.map((privilege) => (
              <TableRow key={privilege.name}>
                <TableCell className="font-medium">{privilege.name}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      privilege.type === "SYSTEM"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                    }`}
                  >
                    {privilege.type}
                  </span>
                </TableCell>
                <TableCell>{privilege.description || 'No description'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => setPrivilegeToDelete(privilege.name)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Privilege
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!privilegeToDelete} onOpenChange={() => setPrivilegeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the privilege
              and remove it from all associated roles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => privilegeToDelete && handleDeletePrivilege(privilegeToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default PrivilegesTable

