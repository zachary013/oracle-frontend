"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { AWRReport } from "@/lib/types"

interface AWRReportChartProps {
  data: AWRReport[]
}

export function AWRReportChart({ data }: AWRReportChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AWR Report Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="h-[400px]"
          config={{
            cpu_usage_percent: {
              label: "CPU Usage (%)",
              color: "hsl(var(--primary))",
            },
            memory_usage_mb: {
              label: "Memory Usage (MB)",
              color: "hsl(var(--secondary))",
            },
            io_requests_per_sec: {
              label: "IO Requests/Sec",
              color: "hsl(var(--accent))",
            },
          }}
        >
          <BarChart data={data}>
            <Bar dataKey="CPU_USAGE_PERCENT" />
            <Bar dataKey="MEMORY_USAGE_MB" />
            <Bar dataKey="IO_REQUESTS_PER_SEC" />
            <ChartTooltip />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

