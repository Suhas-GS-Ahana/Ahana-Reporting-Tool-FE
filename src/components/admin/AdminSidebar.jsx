"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  LayoutDashboard,
  Shield,
  FileText,
  UserCog,
  ClipboardList,
  Activity,
  Terminal,
  FileCode
} from "lucide-react" // Import the icons you need

const adminRoutes = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Roles",
    icon: Shield, 
    href: "/admin/roles",
  },
  {
    title: "Map Roles", 
    icon: UserCog, 
    href: "/admin/map-roles",
  },
  {
    title: "Pages",
    icon: FileText, 
    href: "/admin/pages",
  },
  {
    title: "User Logs",
    icon: ClipboardList, 
    href: "/admin/user-logs",
  },
  {
    title: "Process Logs",
    icon: FileCode, 
    href: "/admin/process-logs",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="hidden border-r bg-background lg:block w-64 h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {adminRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
