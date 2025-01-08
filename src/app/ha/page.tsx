import { Suspense } from 'react'
import { DataGuardStatusComponent } from '../components/data-guard-status'
import { DataGuardConfigComponent } from '../components/data-guard-config'
import { HAOperationsComponent } from '../components/ha-operations'
import { AvailabilityReportComponent } from '../components/availability-report'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HADashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Oracle High Availability Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Guard Status</CardTitle>
            <CardDescription>Current status of Data Guard configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading status...</div>}>
              <DataGuardStatusComponent />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Data Guard Configuration</CardTitle>
            <CardDescription>Configure Data Guard settings</CardDescription>
          </CardHeader>
          <CardContent>
            <DataGuardConfigComponent />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>HA Operations</CardTitle>
            <CardDescription>Perform failover and switchback operations</CardDescription>
          </CardHeader>
          <CardContent>
            <HAOperationsComponent />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Availability Report</CardTitle>
            <CardDescription>View availability statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading report...</div>}>
              <AvailabilityReportComponent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

