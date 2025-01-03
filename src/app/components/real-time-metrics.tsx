import { PerformanceMetrics } from "@/lib/types"

interface RealTimeMetricsProps {
  metrics: PerformanceMetrics
}

export function RealTimeMetrics({ metrics }: RealTimeMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="CPU Usage" value={`${metrics.cpuUsagePercent.toFixed(2)}%`} />
      <MetricCard title="Memory Usage (SGA)" value={`${metrics.memoryUsageMB.toFixed(2)} MB`} />
      <MetricCard title="Memory Usage (PGA)" value={`${metrics.pgaUsageMB.toFixed(2)} MB`} />
      <MetricCard title="Buffer Cache Hit Ratio" value={`${metrics.bufferCacheHitRatio.toFixed(2)}%`} />
      <MetricCard title="I/O Operations per Second" value={metrics.ioOperationsPerSecond.toFixed(2)} />
      <MetricCard title="Last Updated" value={new Date(metrics.timestamp).toLocaleString()} />
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm p-4">
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

