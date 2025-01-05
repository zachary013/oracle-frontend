"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { endpoints } from "../api/config"
import { SlowQuery } from "@/lib/types"
import TuningRecommendations from "./tuning-recommendations"

interface SlowQueriesProps {
  setError: (error: string | null) => void
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

export default function SlowQueries({ setError }: SlowQueriesProps) {
  const [slowQueries, setSlowQueries] = useState<SlowQuery[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchSlowQueries = async () => {
    setLoading(true)
    try {
      const response = await fetch(endpoints.slowQueries)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: SlowQuery[] = await response.json()

      const processedData = data.map((query) => ({
        ...query,
        elapsedTimeSecs: query.elapsedTime / 1e6, // Convert nanoseconds to seconds
        avgElapsedSecs: query.elapsedTime / (query.executions || 1) / 1e6 // Avoid division by zero
      }))

      setSlowQueries(processedData)
    } catch (e) {
      console.error("Failed to fetch slow queries:", e)
      setError("Failed to load slow queries. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlowQueries()
  }, [])

  const filteredData = slowQueries.filter(query =>
    Object.values(query).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search slow queries..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setCurrentPage(1)
        }}
        className="max-w-sm"
      />
      <Button onClick={fetchSlowQueries} disabled={loading} className="mb-4">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Refresh Slow Queries
      </Button>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SQL ID</TableHead>
              <TableHead>Elapsed Time (s)</TableHead>
              <TableHead>Executions</TableHead>
              <TableHead>Avg Elapsed (s)</TableHead>
              <TableHead>SQL Text</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((query) => (
              <TableRow key={query.id}>
                <TableCell>{query.sqlId}</TableCell>
                <TableCell>{query.elapsedTimeSecs?.toFixed(2)}</TableCell>
                <TableCell>{query.executions}</TableCell>
                <TableCell>{query.avgElapsedSecs?.toFixed(2)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View SQL
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[800px] max-h-[600px] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>SQL Text for ID: {query.sqlId}</DialogTitle>
                      </DialogHeader>
                      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
                        {query.sqlText}
                      </pre>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <TuningRecommendations id={query.id} setError={setError} />
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
