"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Database, Save, RefreshCw, CheckCircle, Loader2 , AlertCircle } from 'lucide-react'
import RmanTable from "../components/rman-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PerformBackupForm } from "../components/perform-backup-form"
import { BackupHistory } from "@/lib/types"
import { endpoints } from "../api/config"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AlertStatus = {
  type: 'processing' | 'success' | 'error';
  message: string;
}

export default function RmanPage() {
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false)
  const [backups, setBackups] = useState<BackupHistory[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [alertStatus, setAlertStatus] = useState<AlertStatus | null>(null)

  const fetchBackups = async () => {
    try {
      setLoading(true)
      const response = await fetch(endpoints.rmanBackups)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setBackups(data)
    } catch (e) {
      console.error("Failed to fetch backups:", e)
      setError("Failed to load backups. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBackups()
  }, [])

  const performFullBackup = async () => {
    setAlertStatus({ type: 'processing', message: "Performing full backup..." })
    try {
      const response = await fetch(endpoints.rmanFullBackup, { method: 'POST' })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setAlertStatus({ type: 'success', message: "Full backup completed successfully." })
      await fetchBackups()
    } catch (e) {
      console.error("Failed to perform full backup:", e)
      setAlertStatus({ type: 'error', message: "Failed to perform full backup. Please try again later." })
    }
  }

  const performRestore = async () => {
    setAlertStatus({ type: 'processing', message: "Performing restore..." })
    try {
      const response = await fetch(endpoints.rmanRestore, { method: 'POST' })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    //   const result = await response.text()
      setAlertStatus({ type: 'success', message: `Restore completed !` })
      await fetchBackups()

    } catch (e) {
      console.error("Failed to perform restore:", e)
      setAlertStatus({ type: 'error', message: "Failed to perform restore. Please try again later." })
    }
  }

  const renderAlert = () => {
    if (!alertStatus) return null;

    const { type, message } = alertStatus;
    let icon;
    switch (type) {
      case 'processing':
        icon = <Loader2 className="h-4 w-4 animate-spin" />;
        break;
      case 'success':
        icon = <CheckCircle className="h-4 w-4 text-green-500" />;
        break;
      case 'error':
        icon = <AlertCircle className="h-4 w-4 text-red-500" />;
        break;
    }

    return (
      <Alert>
        {icon}
        <AlertTitle className="capitalize">{type}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RMAN Operations</h1>
          <p className="text-muted-foreground">
            Manage Oracle database backups and restores
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={performFullBackup} size="default" disabled={alertStatus?.type === 'processing'}>
            <Database className="mr-2 h-4 w-4" />
            Full Backup
          </Button>
          <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
            <Button onClick={() => setIsBackupDialogOpen(true)} size="default" disabled={alertStatus?.type === 'processing'}>
              <Save className="mr-2 h-4 w-4" />
              Incremental Backup
            </Button>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Perform Incremental Backup</DialogTitle>
              </DialogHeader>
              <PerformBackupForm
                onSuccess={() => {
                  setIsBackupDialogOpen(false)
                  fetchBackups()
                }}
                setAlertStatus={setAlertStatus}
              />
            </DialogContent>
          </Dialog>
          <Button onClick={performRestore} size="default" disabled={alertStatus?.type === 'processing'}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restore
          </Button>
        </div>
      </div>

      {renderAlert()}

      <RmanTable
        backups={backups}
        error={error}
        loading={loading}
        setBackups={setBackups}
        setError={setError}
        setLoading={setLoading}
      />
    </div>
  )
}

