"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { endpoints } from "../api/config"

interface GatherTableStatsProps {
  setError: (error: string | null) => void
}

export default function GatherTableStats({ setError }: GatherTableStatsProps) {
  const [schemaName, setSchemaName] = useState("")
  const [tableName, setTableName] = useState("")
  const [loading, setLoading] = useState(false)

  const gatherTableStats = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        schemaName: schemaName,
        tableName: tableName
      });
      const url = `${endpoints.gatherTableStats}?${params.toString()}`;
      const response = await fetch(url, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setError("Table statistics gathered successfully.")
    } catch (e) {
      console.error("Failed to gather table statistics:", e)
      setError("Failed to gather table statistics. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Gather Table Statistics</h3>
      <div className="flex space-x-2">
        <Input
          placeholder="Schema Name"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
        />
        <Input
          placeholder="Table Name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
        <Button onClick={gatherTableStats} disabled={loading || !schemaName || !tableName}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Gather Stats
        </Button>
      </div>
    </div>
  )
}

