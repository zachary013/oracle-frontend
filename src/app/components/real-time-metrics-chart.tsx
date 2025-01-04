import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { PerformanceMetrics } from "@/lib/types";

interface RealTimeMetricsChartProps {
  latestMetrics: PerformanceMetrics;
}

export function RealTimeMetricsChart({
  latestMetrics,
}: RealTimeMetricsChartProps) {
  const [data, setData] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    setData((prevData) => {
      const newData = [...prevData, latestMetrics];
      if (newData.length > 20) {
        return newData.slice(-20);
      }
      return newData;
    });
  }, [latestMetrics]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Metrics Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: "300px" }}>
          <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
            <YAxis />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="cpuUsagePercent"
              stroke="hsl(var(--primary))"
              name="CPU Usage (%)"
            />
            <Line
              type="monotone"
              dataKey="memoryUsageMB"
              stroke="hsl(var(--secondary))"
              name="Memory Usage (MB)"
            />
            <Line
              type="monotone"
              dataKey="ioOperationsPerSecond"
              stroke="hsl(var(--accent))"
              name="IO Ops/Sec"
            />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
}