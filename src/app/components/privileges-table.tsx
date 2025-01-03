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
import { Loader2, Info } from "lucide-react"

interface PrivilegesTableProps {
  privileges: string[]
  error: string
  loading: boolean
  onPrivilegeSelect: (name: string) => void
}

export default function PrivilegesTable({
  privileges,
  error,
  loading,
  onPrivilegeSelect,
}: PrivilegesTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Privilege Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {privileges.map((privilege) => (
            <TableRow key={privilege}>
              <TableCell className="font-medium">{privilege}</TableCell>
              <TableCell>
                {privilege.includes("OBJECT_") ? "OBJECT" : "SYSTEM"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPrivilegeSelect(privilege)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}