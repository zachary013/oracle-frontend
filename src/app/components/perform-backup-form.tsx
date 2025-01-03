"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { endpoints } from "../api/config"

interface PerformBackupFormProps {
  onSuccess: () => void
  setAlertStatus: (status: { type: 'processing' | 'success' | 'error'; message: string }) => void
}

export function PerformBackupForm({ onSuccess, setAlertStatus }: PerformBackupFormProps) {
  const [level, setLevel] = useState<string>("0")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setAlertStatus({ type: 'processing', message: `Performing incremental backup (Level ${level})...` })

    try {
      const response = await fetch(`${endpoints.rmanIncrementalBackup}/${level}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setAlertStatus({ type: 'success', message: `Incremental backup (Level ${level}) completed successfully.` })
      onSuccess()
    } catch (error) {
      console.error("Failed to perform incremental backup:", error)
      setAlertStatus({ type: 'error', message: "Failed to perform incremental backup. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={level} onValueChange={setLevel}>
        <SelectTrigger>
          <SelectValue placeholder="Select backup level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Level 0</SelectItem>
          <SelectItem value="1">Level 1</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Performing Backup..." : "Perform Incremental Backup"}
      </Button>
    </form>
  )
}

