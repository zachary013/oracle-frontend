import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { ASHReport } from "@/lib/types"
  
  interface ASHReportTableProps {
    data: ASHReport[]
  }
  
  export function ASHReportTable({ data }: ASHReportTableProps) {
    console.log("ASH Report Data:", data)
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session ID</TableHead>
            <TableHead>SQL ID</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Wait Class</TableHead>
            <TableHead>Session State</TableHead>
            <TableHead>Time Waited</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.SESSION_ID}</TableCell>
              <TableCell>{row.SQL_ID}</TableCell>
              <TableCell>{row.EVENT || "N/A"}</TableCell>
              <TableCell>{row.WAIT_CLASS || "N/A"}</TableCell>
              <TableCell>{row.SESSION_STATE}</TableCell>
              <TableCell>{row.TIME_WAITED}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  