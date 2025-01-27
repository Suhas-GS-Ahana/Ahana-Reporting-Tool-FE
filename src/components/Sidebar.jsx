"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn, sidebarItems } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden h-screen border-r bg-blue-950 md:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

