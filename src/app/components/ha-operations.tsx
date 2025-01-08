'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { endpoints } from '@/app/api/config'
import { Loader2 } from 'lucide-react'

export function HAOperationsComponent() {
  const [isFailoverLoading, setIsFailoverLoading] = useState(false)
  const [isSwitchbackLoading, setIsSwitchbackLoading] = useState(false)

  const performOperation = async (operation: 'failover' | 'switchback') => {
    const setLoading = operation === 'failover' ? setIsFailoverLoading : setIsSwitchbackLoading
    setLoading(true)
    try {
      const endpoint = operation === 'failover' ? endpoints.haSimulateFailover : endpoints.haSimulateSwitchback
      const res = await fetch(endpoint, { method: 'POST' })
      if (!res.ok) throw new Error(`Failed to simulate ${operation}`)
      const data = await res.json()
      
      toast({
        title: "Operation Successful",
        description: `${operation.charAt(0).toUpperCase() + operation.slice(1)} simulated successfully. Execution time: ${data.executionTime}ms`,
      })

      // If you want to trigger a refresh of the Data Guard status, you can call a function here
      // For example: onOperationComplete()
    } catch (error) {
      console.error(`Error during ${operation} simulation:`, error)
      toast({
        title: "Operation Failed",
        description: `Failed to simulate ${operation}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => performOperation('failover')} 
        disabled={isFailoverLoading || isSwitchbackLoading}
        className="w-full"
      >
        {isFailoverLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Simulating Failover...
          </>
        ) : (
          'Simulate Failover'
        )}
      </Button>
      <Button 
        onClick={() => performOperation('switchback')} 
        disabled={isFailoverLoading || isSwitchbackLoading}
        className="w-full"
      >
        {isSwitchbackLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Simulating Switchback...
          </>
        ) : (
          'Simulate Switchback'
        )}
      </Button>
    </div>
  )
}

