import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { Home, Cog, FileSliders, Network, VaultIcon, BoxIcon, BotIcon } from "lucide-react"

// Utility Function for Class Names
// To cleanly combine Tailwind CSS class names — handling conditional logic, deduplication,
// and resolving conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// Sidebar data
export const sidebarItems = [
  {
    title: "Home",
    href: "/home",
    icon: Home,
  },
  {
    title: "Connections",
    href: "/connections",
    icon: Network,
  },
  {
    title: "Configurations",
    href: "/configurations",
    icon: Cog,
  },
  {
    title: "Process",
    href: "/process",
    icon: FileSliders,
  },
  {
    title: "New Configurations",
    href: "/new-configurations",
    icon: BoxIcon,
  },
  {
    title: "Temp Configurations",
    href: "/temp-configurations",
    icon: BotIcon,
  }
]