"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"

interface PrivilegesTableProps {
  privileges: string[]
  error: string
  loading: boolean
  onPrivilegeSelect: (name: string) => void
}

const ITEMS_PER_PAGE = 10
const MAX_VISIBLE_PAGES = 7

const getVisiblePages = (current: number, total: number) => {
  if (total <= MAX_VISIBLE_PAGES) return Array.from({ length: total }, (_, i) => i + 1)

  let start = Math.max(1, current - Math.floor(MAX_VISIBLE_PAGES / 2))
  let end = start + MAX_VISIBLE_PAGES - 1

  if (end > total) {
    end = total
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function PrivilegesTable({
  privileges,
  error,
  loading,
  onPrivilegeSelect,
}: PrivilegesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

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

  const filteredPrivileges = privileges.filter(privilege =>
    privilege.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredPrivileges.length / ITEMS_PER_PAGE)
  const paginatedPrivileges = filteredPrivileges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search privileges..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setCurrentPage(1)
        }}
        className="max-w-sm"
      />
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
            {paginatedPrivileges.map((privilege) => (
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
      {totalPages > 1 && (
        <div className="flex justify-center overflow-x-auto px-2">
          <div className="inline-flex items-center justify-start gap-1">
            <Pagination>
              <PaginationContent className="flex-nowrap gap-1">
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                {getVisiblePages(currentPage, totalPages).map((page) => (
                  <PaginationItem key={page}>
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  )
}

