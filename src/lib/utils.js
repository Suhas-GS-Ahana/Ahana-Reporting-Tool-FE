import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { History, LayoutDashboard, Settings, FileSpreadsheet, UserCircle } from "lucide-react"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sidebarItems = [
  {
    title: "New Process",
    href: "/new-process",
    icon: LayoutDashboard,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  {
    title: "Transactions & Logs",
    href: "/transactions",
    icon: FileSpreadsheet,
  },
  {
    title: "Configurations",
    href: "/configurations",
    icon: Settings,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserCircle,
  },
]
