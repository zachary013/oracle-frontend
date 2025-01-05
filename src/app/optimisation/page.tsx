"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import SlowQueries from "../components/slow-queries"
import TuningRecommendations from "../components/tuning-recommendations"
import GatherTableStats from "../components/gather-table-stats"
import ScheduleStatsGathering from "../components/schedule-stats-gathering"

export default function OptimizationPage() {
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Optimization</h1>
        <p className="text-muted-foreground">
          Optimize Oracle database performance with slow query analysis and statistics management
        </p>
      </div>

      {error && (
        <Alert variant={error.includes("successfully") ? "default" : "destructive"}>
          <AlertTitle>{error.includes("successfully") ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="slow-queries">
        <TabsList>
          <TabsTrigger value="slow-queries">Slow Queries</TabsTrigger>
          <TabsTrigger value="statistics">Statistics Management</TabsTrigger>
        </TabsList>
        <TabsContent value="slow-queries">
          <Card>
            <CardHeader>
              <CardTitle>Slow Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <SlowQueries setError={setError} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Statistics Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <GatherTableStats setError={setError} />
                <ScheduleStatsGathering setError={setError} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

