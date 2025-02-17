"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  LayoutDashboard,
  Shield,
  FileText
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
    icon: Shield, // Icon for Roles (can change based on preference)
    href: "/admin/roles",
  },
  {
    title: "Pages",
    icon: FileText, // Icon for Pages (or another appropriate one)
    href: "/admin/pages",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="hidden border-r bg-background lg:block w-64">
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
