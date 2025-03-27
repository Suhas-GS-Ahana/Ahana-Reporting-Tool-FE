"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn, sidebarItems } from "@/lib/utils"
import { History, LayoutDashboard, Settings, FileSpreadsheet, UserCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Sidebar() {
  const pathname = usePathname()
  const { user, sidebarExpanded } = useAuth()

  if (!user) return null

  return (
    <div
      className={cn(
        "min-h-screen border-r transition-all duration-300 ease-in-out",
        sidebarExpanded ? "w-50" : "w-16",
      )}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "",
                        sidebarExpanded ? "justify-start" : "justify-center",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {sidebarExpanded && <span className="ml-3">{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={cn(sidebarExpanded && "hidden")}>
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

