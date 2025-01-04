import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [selectedMetric, setSelectedMetric] = useState<string>("cpuUsagePercent");

  useEffect(() => {
    setData((prevData) => {
      const newData = [...prevData, latestMetrics];
      if (newData.length > 20) {
        return newData.slice(-20);
      }
      return newData;
    });
  }, [latestMetrics]);

  const maxMemory = Math.max(...data.map((d) => d.memoryUsageMB), 1000);
  const maxIO = Math.max(...data.map((d) => d.ioOperationsPerSecond), 1e10);

  const memoryMaxWithMargin = Math.ceil(maxMemory * 1.1 / 100) * 100;
  const ioMaxWithMargin = Math.ceil(maxIO * 1.1 / 1e10) * 1e10;

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Metrics Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Button
            variant={selectedMetric === "cpuUsagePercent" ? "default" : "outline"}
            onClick={() => handleMetricChange("cpuUsagePercent")}
          >
            CPU Usage
          </Button>
          <Button
            variant={selectedMetric === "memoryUsageMB" ? "default" : "outline"}
            onClick={() => handleMetricChange("memoryUsageMB")}
          >
            Memory Usage
          </Button>
          <Button
            variant={selectedMetric === "ioOperationsPerSecond" ? "default" : "outline"}
            onClick={() => handleMetricChange("ioOperationsPerSecond")}
          >
            IO Operations
          </Button>
        </div>
        <div style={{ height: "300px" }}>
          <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis
              domain={
                selectedMetric === "cpuUsagePercent"
                  ? [0, 100]
                  : selectedMetric === "memoryUsageMB"
                  ? [0, memoryMaxWithMargin]
                  : [0, ioMaxWithMargin]
              }
              label={{
                value:
                  selectedMetric === "cpuUsagePercent"
                    ? "CPU (%)"
                    : selectedMetric === "memoryUsageMB"
                    ? "Memory (MB)"
                    : "IO (Ops/Sec)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            {selectedMetric === "cpuUsagePercent" && (
              <Line
                type="monotone"
                dataKey="cpuUsagePercent"
                stroke="#1a73e8"
                name="CPU Usage (%)"
              />
            )}
            {selectedMetric === "memoryUsageMB" && (
              <Line
                type="monotone"
                dataKey="memoryUsageMB"
                stroke="#0d47a1"
                name="Memory Usage (MB)"
              />
            )}
            {selectedMetric === "ioOperationsPerSecond" && (
              <Line
                type="monotone"
                dataKey="ioOperationsPerSecond"
                stroke="#004d40"
                name="IO Ops/Sec"
              />
            )}
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
}