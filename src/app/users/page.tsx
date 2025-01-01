import { Button } from "@/components/ui/button"
import { UsersTable } from "../components/users-table"
import { Plus } from 'lucide-react'

const mockUsers = [
  {
    username: "admin",
    status: "active" as const,
    roles: ["DBA", "ADMIN"],
  },
  {
    username: "john.doe",
    status: "active" as const,
    roles: ["DEVELOPER"],
  },
  {
    username: "jane.smith",
    status: "locked" as const,
    roles: ["ANALYST"],
  },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <UsersTable users={mockUsers} />
    </div>
  )
}

