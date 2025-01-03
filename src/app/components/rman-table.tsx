import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BackupHistory } from "@/lib/types"

interface RmanTableProps {
  backups: BackupHistory[]
  error: string
  loading: boolean
  setBackups: React.Dispatch<React.SetStateAction<BackupHistory[]>>
  setError: React.Dispatch<React.SetStateAction<string>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function RmanTable({ backups, error, loading, setBackups, setError, setLoading }: RmanTableProps) {
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {backups.map((backup) => (
          <TableRow key={backup.id}>
            <TableCell>{backup.id}</TableCell>
            <TableCell>{backup.type}</TableCell>
            <TableCell>{backup.status}</TableCell>
            <TableCell>{new Date(backup.timestamp).toLocaleString()}</TableCell>
            <TableCell>{backup.details}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

