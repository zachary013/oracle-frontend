import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { AWRReport } from "@/lib/types"
  
  interface AWRReportTableProps {
    data: AWRReport[]
  }
  
  export function AWRReportTable({ data }: AWRReportTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Snap ID</TableHead>
            <TableHead>Begin Interval</TableHead>
            <TableHead>End Interval</TableHead>
            <TableHead>CPU Usage (%)</TableHead>
            <TableHead>Memory Usage (MB)</TableHead>
            <TableHead>I/O Requests/sec</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.SNAP_ID}>
              <TableCell>{row.SNAP_ID}</TableCell>
              <TableCell>{new Date(row.BEGIN_INTERVAL_TIME).toLocaleString()}</TableCell>
              <TableCell>{new Date(row.END_INTERVAL_TIME).toLocaleString()}</TableCell>
              <TableCell>{row.CPU_USAGE_PERCENT.toFixed(2)}</TableCell>
              <TableCell>{row.MEMORY_USAGE_MB.toFixed(2)}</TableCell>
              <TableCell>{row.IO_REQUESTS_PER_SEC.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  