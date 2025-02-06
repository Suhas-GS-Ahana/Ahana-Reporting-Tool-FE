import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { History, LayoutDashboard, Settings, FileSpreadsheet, UserCircle } from "lucide-react"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sidebarItems = [
  {
    title: "Configurations",
    href: "/configurations",
    icon: Settings,
  },
  {
    title: "Process",
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
    title: "Profile",
    href: "/profile",
    icon: UserCircle,
  },
]

export const invoices = [
  {
    invoice: "conn1",
    paymentStatus: "Public",
    totalAmount: "2",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "conn2",
    paymentStatus: "Private",
    totalAmount: "4",
    paymentMethod: "PayPal",
  },
  {
    invoice: "conn3",
    paymentStatus: "public",
    totalAmount: "1",
    paymentMethod: "Bank Transfer",
  },
  // {
  //   invoice: "INV004",
  //   paymentStatus: "Paid",
  //   totalAmount: "$450.00",
  //   paymentMethod: "Credit Card",
  // },
  // {
  //   invoice: "INV005",
  //   paymentStatus: "Paid",
  //   totalAmount: "$550.00",
  //   paymentMethod: "PayPal",
  // },
  // {
  //   invoice: "INV006",
  //   paymentStatus: "Pending",
  //   totalAmount: "$200.00",
  //   paymentMethod: "Bank Transfer",
  // },
  // {
  //   invoice: "INV007",
  //   paymentStatus: "Unpaid",
  //   totalAmount: "$300.00",
  //   paymentMethod: "Credit Card",
  // },
]