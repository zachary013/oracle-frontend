"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Shield, Users, Key, Menu } from 'lucide-react'
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { useSidebar } from "../components/ui/sidebar-context"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Roles", href: "/roles", icon: Shield },
  { name: "Privileges", href: "/privileges", icon: Key },
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
          <h1 className="text-xl font-bold text-foreground">Oracle Manager</h1>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
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
        </nav>
        <div className="p-4 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">© 2024 Oracle Manager</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}

