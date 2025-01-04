"use client"

import { useState, useEffect } from "react"
import PrivilegesTable from "../components/privileges-table"
import { endpoints } from "../api/config"

export default function PrivilegesPage() {
  const [privileges, setPrivileges] = useState<string[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [selectedPrivilege, setSelectedPrivilege] = useState<string | null>(null)

  const fetchPrivileges = async () => {
    try {
      setLoading(true)
      const response = await fetch(endpoints.privileges)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPrivileges(data)
    } catch (e) {
      console.error("Failed to fetch privileges:", e)
      setError("Failed to load privileges. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchPrivilegeDetails = async (name: string) => {
    try {
      const response = await fetch(`${endpoints.privileges}/${name}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Handle the privilege details as needed
      console.log(data)
    } catch (e) {
      console.error("Failed to fetch privilege details:", e)
    }
  }

  useEffect(() => {
    fetchPrivileges()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oracle Privileges</h1>
          <p className="text-muted-foreground">
            View available Oracle database privileges
          </p>
        </div>
      </div>

      <PrivilegesTable
        privileges={privileges}
        error={error}
        loading={loading}
        onPrivilegeSelect={fetchPrivilegeDetails}
      />
    </div>
  )
}