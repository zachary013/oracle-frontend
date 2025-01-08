"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Shield, Users, Key, Menu, Settings, LineChart, Lock, Database, Activity, ServerCog } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useSidebar } from "../components/ui/sidebar-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navigation = [
  {
    name: "Core",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Users", href: "/users", icon: Users },
      { name: "Roles", href: "/roles", icon: Shield },
      { name: "Privileges", href: "/privileges", icon: Key },
    ]
  },
  {
    name: "System",
    items: [
      { name: "Security", href: "/security", icon: Lock },
      { name: "Rman", href: "/rman", icon: Database },
      { name: "Performance", href: "/performance", icon: Activity },
      { name: "Optimisations", href: "/optimisation", icon: LineChart },
      { name: "High Availability", href: "/ha", icon: ServerCog },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebar()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggle}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-card transition-transform duration-200 ease-in-out md:static",
        !isOpen && "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/logo2.png"
              alt="Oracle Manager Logo"
              width={150}
              height={40}
              className="h-auto w-auto"
              priority
            />
          </Link>
        </div>
        <nav className="flex-1 space-y-6 px-4">
          {navigation.map((group) => (
            <div key={group.name}>
              <h2 className="mb-2 px-2 text-sm font-semibold tracking-tight text-muted-foreground">
                {group.name}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
              {group.name === "Core" && <Separator className="my-4" />}
            </div>
          ))}
        </nav>
        <div className="p-4">
          <span className="text-xs text-muted-foreground">© 2024 Oracle Manager</span>
        </div>
      </div>
    </>
  )
}

