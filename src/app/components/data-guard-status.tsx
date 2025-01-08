import type { DataGuardStatus } from '@/lib/types'
import { Badge } from "@/components/ui/badge"
import { endpoints } from '@/app/api/config'

async function getDataGuardStatus(): Promise<DataGuardStatus> {
  const res = await fetch(endpoints.haStatus, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch Data Guard status')
  return res.json()
}

export async function DataGuardStatusComponent() {
  const status = await getDataGuardStatus()

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-semibold">Database Role:</span>
        <span>{status.databaseRole}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Protection Mode:</span>
        <span>{status.protectionMode}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Switchover Status:</span>
        <span>{status.switchoverStatus}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">Status:</span>
        <Badge variant={status.status === 'ONLINE' ? 'default' : 'destructive'}>
          {status.status}
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Last Updated:</span>
        <span>{new Date(status.timestamp).toLocaleString()}</span>
      </div>
    </div>
  )
}

