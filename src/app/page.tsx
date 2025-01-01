import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Key } from 'lucide-react'

export default function DashboardPage() {
  // In a real app, these would be fetched from your API
  const stats = [
    {
      name: "Total Users",
      value: "25",
      icon: Users,
    },
    {
      name: "Total Roles",
      value: "10",
      icon: Shield,
    },
    {
      name: "Total Privileges",
      value: "30",
      icon: Key,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

