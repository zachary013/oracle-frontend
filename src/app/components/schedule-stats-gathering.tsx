"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { endpoints } from "../api/config"

interface ScheduleStatsGatheringProps {
  setError: (error: string | null) => void
}

export default function ScheduleStatsGathering({ setError }: ScheduleStatsGatheringProps) {
  const [schemaName, setSchemaName] = useState("")
  const [loading, setLoading] = useState(false)

  const scheduleStatsGathering = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ schemaName: schemaName });
      const url = `${endpoints.scheduleStatsGathering}?${params.toString()}`;
      const response = await fetch(url, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setError("Statistics gathering job scheduled successfully.")
    } catch (e) {
      console.error("Failed to schedule statistics gathering:", e)
      setError("Failed to schedule statistics gathering. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Schedule Statistics Gathering Job</h3>
      <div className="flex space-x-2">
        <Input
          placeholder="Schema Name"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
        />
        <Button onClick={scheduleStatsGathering} disabled={loading || !schemaName}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Schedule Job
        </Button>
      </div>
    </div>
  )
}

