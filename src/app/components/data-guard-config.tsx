'use client'

import { useState } from 'react'
import { DataGuardConfig } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { endpoints } from '@/app/api/config'

export function DataGuardConfigComponent() {
  const [config, setConfig] = useState<DataGuardConfig>({
    primaryHost: '',
    primaryPort: 1521,
    standbyHost: '',
    standbyPort: 1521,
    sysdbaUsername: '',
    sysdbaPassword: '',
    primaryDbName: '',
    standbyDbName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(endpoints.haConfig, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error('Failed to configure Data Guard')
      toast({
        title: "Success",
        description: "Data Guard configured successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to configure Data Guard",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primaryHost">Primary Host</Label>
          <Input
            id="primaryHost"
            value={config.primaryHost}
            onChange={(e) => setConfig({ ...config, primaryHost: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryPort">Primary Port</Label>
          <Input
            id="primaryPort"
            type="number"
            value={config.primaryPort}
            onChange={(e) => setConfig({ ...config, primaryPort: parseInt(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="standbyHost">Standby Host</Label>
          <Input
            id="standbyHost"
            value={config.standbyHost}
            onChange={(e) => setConfig({ ...config, standbyHost: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="standbyPort">Standby Port</Label>
          <Input
            id="standbyPort"
            type="number"
            value={config.standbyPort}
            onChange={(e) => setConfig({ ...config, standbyPort: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sysdbaUsername">SYSDBA Username</Label>
        <Input
          id="sysdbaUsername"
          value={config.sysdbaUsername}
          onChange={(e) => setConfig({ ...config, sysdbaUsername: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sysdbaPassword">SYSDBA Password</Label>
        <Input
          id="sysdbaPassword"
          type="password"
          value={config.sysdbaPassword}
          onChange={(e) => setConfig({ ...config, sysdbaPassword: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primaryDbName">Primary DB Name</Label>
          <Input
            id="primaryDbName"
            value={config.primaryDbName}
            onChange={(e) => setConfig({ ...config, primaryDbName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="standbyDbName">Standby DB Name</Label>
          <Input
            id="standbyDbName"
            value={config.standbyDbName}
            onChange={(e) => setConfig({ ...config, standbyDbName: e.target.value })}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Configure Data Guard</Button>
    </form>
  )
}

