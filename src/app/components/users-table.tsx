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
import { Lock, MoreHorizontal, Unlock, Shield, Trash, AlertCircle } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import React, { Dispatch, SetStateAction } from 'react'
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

interface UsersTableProps {
  users: User[]
  error: string
  loading: boolean
  setUsers: Dispatch<SetStateAction<User[]>>
  setError: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  error,
  loading,
  setUsers,
  setError,
  setLoading,
}) => {
  const [userToDelete, setUserToDelete] = React.useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users')
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
      const response = await fetch(`http://localhost:8080/api/users/${username}/lock`, {
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
      const response = await fetch(`http://localhost:8080/api/users/${username}/unlock`, {
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
      const response = await fetch(`http://localhost:8080/api/users/${username}`, {
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
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.username}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      user.status?.toLowerCase() === "unlocked"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    }`}
                  >
                    {user.status || 'Unknown'}
                  </span>
                </TableCell>
                <TableCell>{user.roles?.join(", ") || 'No roles'}</TableCell>
                <TableCell>{user.defaultTablespace || 'N/A'}</TableCell>
                <TableCell>{user.temporaryTablespace || 'N/A'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {}}>
                        <Shield className="mr-2 h-4 w-4" />
                        Manage Roles
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          user.status?.toLowerCase() === "unlocked"
                            ? handleLockAccount(user.username)
                            : handleUnlockAccount(user.username)
                        }
                      >
                        {user.status?.toLowerCase() === "unlocked" ? (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Lock Account
                          </>
                        ) : (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Unlock Account
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

