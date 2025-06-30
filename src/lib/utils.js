import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { Home, Cog, FileSliders, Network, VaultIcon, BoxIcon, BotIcon, CatIcon, DogIcon, CarIcon } from "lucide-react"

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
]