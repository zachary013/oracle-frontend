//src/app/components/availability-report.tsx
import { AvailabilityReport } from '@/lib/types'
import { Progress } from "@/components/ui/progress"
import { endpoints } from '@/app/api/config'

async function getAvailabilityReport(): Promise<AvailabilityReport> {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const res = await fetch(`${endpoints.haReport}?startDate=${startDate}&endDate=${endDate}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch availability report')
  return res.json()
}

export async function AvailabilityReportComponent() {
  const report = await getAvailabilityReport()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Total Simulations:</span>
          <span>{report.totalSimulations}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Failover Success Rate:</span>
            <span>{(report.failoverSuccessRate * 100).toFixed(2)}%</span>
          </div>
          <Progress value={report.failoverSuccessRate * 100} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Switchback Success Rate:</span>
            <span>{(report.switchbackSuccessRate * 100).toFixed(2)}%</span>
          </div>
          <Progress value={report.switchbackSuccessRate * 100} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Avg. Failover Time:</span>
          <span>{report.avgFailoverTimeMs.toFixed(2)} ms</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Avg. Switchback Time:</span>
          <span>{report.avgSwitchbackTimeMs.toFixed(2)} ms</span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Report period: {report.startDate} to {report.endDate}
      </div>
    </div>
  )
}

