"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "../components/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { endpoints } from "../api/config"
import { PerformanceMetrics, AWRReport, ASHReport } from "@/lib/types"
import { RealTimeMetrics } from "../components/real-time-metrics"
import { RealTimeMetricsChart } from "../components/real-time-metrics-chart"
import { AWRReportTable } from "../components/awr-report-table"
import { AWRReportChart } from "../components/awr-report-chart"
import { ASHReportTable } from "../components/ash-report-table"
import { DateRange } from "react-day-picker"

export default function PerformanceMonitoringPage() {
  const [realTimeMetrics, setRealTimeMetrics] = useState<PerformanceMetrics | null>(null)
  const [awrReport, setAWRReport] = useState<AWRReport[]>([])
  const [ashReport, setASHReport] = useState<ASHReport[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRealTimeMetrics = async () => {
    try {
      const response = await fetch(endpoints.realTimeMetrics)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setRealTimeMetrics(data)
    } catch (e) {
      console.error("Failed to fetch real-time metrics:", e)
      setError("Failed to load real-time metrics. Please try again later.")
    }
  }

  const fetchAWRReport = async () => {
    if (!dateRange || !dateRange.from || !dateRange.to) return

    setLoading(true)
    try {
      const response = await fetch(`${endpoints.awrReport}?start=${dateRange.from.toISOString()}&end=${dateRange.to.toISOString()}`)
      // const response = await fetch(`${endpoints.awrReport}?start=2024-12-31T00:00:00&end=2024-12-31T23:59:59`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAWRReport(data)
    } catch (e) {
      console.error("Failed to fetch AWR report:", e)
      setError("Failed to load AWR report. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchASHReport = async () => {
    setLoading(true)
    try {
      const response = await fetch(endpoints.ashReport)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setASHReport(data)
      // console.log(data)
    } catch (e) {
      console.error("Failed to fetch ASH report:", e)
      setError("Failed to load ASH report. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRealTimeMetrics()
    const interval = setInterval(fetchRealTimeMetrics, 500) 
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (dateRange && dateRange.from && dateRange.to) {
      fetchAWRReport()
    }
  }, [dateRange])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor Oracle database performance metrics and reports
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {realTimeMetrics ? (
              <RealTimeMetrics metrics={realTimeMetrics} />
            ) : (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>

        {realTimeMetrics && <RealTimeMetricsChart latestMetrics={realTimeMetrics} />}
      </div>

      <Tabs defaultValue="awr">
        <TabsList>
          <TabsTrigger value="awr">AWR Report</TabsTrigger>
          <TabsTrigger value="ash">ASH Report</TabsTrigger>
        </TabsList>
        <TabsContent value="awr">
          <Card>
            <CardHeader>
              <CardTitle>AWR Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <DateRangePicker onDateRangeChange={setDateRange} />
                <Button onClick={fetchAWRReport} disabled={!dateRange || loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Report
                </Button>
              </div>
              {awrReport.length > 0 && <AWRReportChart data={awrReport} />}
              <AWRReportTable data={awrReport} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ash">
          <Card>
            <CardHeader>
              <CardTitle>ASH Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchASHReport} disabled={loading} className="mb-4">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Report
              </Button>
              <ASHReportTable data={ashReport} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

