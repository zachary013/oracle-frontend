'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export default function SecurityLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  
  const currentTab = pathname.split('/').pop() || 'tde'

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Database Security</h1>
      <Tabs value={currentTab} className="w-full" onValueChange={(value) => router.push(`/security/${value}`)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tde">Transparent Data Encryption</TabsTrigger>
          <TabsTrigger value="vpd">Virtual Private Database</TabsTrigger>
          <TabsTrigger value="audit">Audit Configuration</TabsTrigger>
        </TabsList>
        <Card className="mt-6">
          {children}
        </Card>
      </Tabs>
    </div>
  )
}

