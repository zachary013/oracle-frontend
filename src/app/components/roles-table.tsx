"use client"

import React, { Dispatch, SetStateAction, useState } from 'react'
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
import { Role, Privilege } from "@/lib/types"
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
import { ManagePrivilegesForm } from "./manage-privileges-form"
import { endpoints } from "@/app/api/config"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface RolesTableProps {
  roles: Role[]
  error: string
  loading: boolean
  setRoles: Dispatch<SetStateAction<Role[]>>
  setError: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
}

const ITEMS_PER_PAGE = 10

const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  error,
  loading,
  setRoles,
  setError,
  setLoading,
}) => {
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)
  const [roleToManage, setRoleToManage] = useState<Role | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(roles.length / ITEMS_PER_PAGE)
  const paginatedRoles = roles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const fetchRoles = async () => {
    try {
      const response = await fetch(endpoints.roles)
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
      const response = await fetch(`${endpoints.roles}/${name}`, {
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
            {paginatedRoles.map((role) => (
              <TableRow key={role.name}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description || 'No description'}</TableCell>
                <TableCell>
                  {role.privileges.length > 0
                    ? role.privileges.map((priv) => priv.name).join(", ")
                    : 'No privileges'}
                </TableCell>
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

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(index + 1);
                }}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

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

