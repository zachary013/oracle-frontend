'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Shield, Lock, FileText } from 'lucide-react'
import { Toaster } from "@/components/ui/toaster"

export default function SecurityLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  
  const currentTab = pathname.split('/').pop() || 'tde'

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Oracle Database Security</h1>
      </div>
      <Tabs value={currentTab} className="w-full" onValueChange={(value) => router.push(`/security/${value}`)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tde" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Transparent Data Encryption</span>
          </TabsTrigger>
          <TabsTrigger value="vpd" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Virtual Private Database</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Audit Configuration</span>
          </TabsTrigger>
        </TabsList>
        <Card className="mt-6 p-6">
          {children}
        </Card>
      </Tabs>
      <Toaster />
    </div>
  )
}

