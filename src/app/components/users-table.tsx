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
import { Lock, MoreHorizontal, Unlock, Shield, Trash, AlertCircle, Edit } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { User } from "@/lib/types"
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

interface UsersTableProps {
  users: User[]
  error: string
  loading: boolean
  setUsers: Dispatch<SetStateAction<User[]>>
  setError: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
  onEditUser: (user: User) => void
  onManageRoles: (user: User) => void
}

const ITEMS_PER_PAGE = 10

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  error,
  loading,
  setUsers,
  setError,
  setLoading,
  onEditUser,
  onManageRoles,
}) => {
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE)
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const fetchUsers = async () => {
    try {
      const response = await fetch(endpoints.users)
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError('Failed to load users. Please try again later.')
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleLockAccount = async (username: string) => {
    try {
      const response = await fetch(`${endpoints.users}/${username}/lock`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to lock account')
      fetchUsers()
      toast.success('Account locked successfully')
    } catch (err) {
      toast.error('Failed to lock account')
    }
  }

  const handleUnlockAccount = async (username: string) => {
    try {
      const response = await fetch(`${endpoints.users}/${username}/unlock`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to unlock account')
      fetchUsers()
      toast.success('Account unlocked successfully')
    } catch (err) {
      toast.error('Failed to unlock account')
    }
  }

  const handleDeleteUser = async (username: string) => {
    try {
      const response = await fetch(`${endpoints.users}/${username}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete user')
      fetchUsers()
      toast.success('User deleted successfully')
    } catch (err) {
      toast.error('Failed to delete user')
    } finally {
      setUserToDelete(null)
    }
  }

  const formatDate = (dateArray: number[] | null) => {
    if (!dateArray) return 'N/A'
    const [year, month, day, hour, minute] = dateArray
    return new Date(year, month - 1, day, hour, minute).toLocaleString()
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
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Default Tablespace</TableHead>
              <TableHead>Temporary Tablespace</TableHead>
              <TableHead>Quota Limit</TableHead>
              <TableHead>Password Expiry</TableHead>
              <TableHead>Failed Logins</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.username}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      !user.accountLocked
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    }`}
                  >
                    {user.accountLocked ? 'Locked' : 'Active'}
                  </span>
                </TableCell>
                <TableCell>{user.roles.map(role => role.name).join(", ") || 'No roles'}</TableCell>
                <TableCell>{user.defaultTablespace}</TableCell>
                <TableCell>{user.temporaryTablespace}</TableCell>
                <TableCell>{user.quotaLimit}</TableCell>
                <TableCell>{formatDate(user.passwordExpiryDate)}</TableCell>
                <TableCell>{user.failedLoginAttempts}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onManageRoles(user)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Manage Roles
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          user.accountLocked
                            ? handleUnlockAccount(user.username)
                            : handleLockAccount(user.username)
                        }
                      >
                        {user.accountLocked ? (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Unlock Account
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Lock Account
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => setUserToDelete(user.username)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete User
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

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and remove their data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default UsersTable

