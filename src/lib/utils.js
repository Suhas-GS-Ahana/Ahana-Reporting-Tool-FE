import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { History, LayoutDashboard, Settings, FileSpreadsheet, UserCircle, Home, Cog, FileSliders, } from "lucide-react"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sidebarItems = [
  {
    title: "Home",
    href: "/home",
    icon: Home,
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
  // {
  //   title: "History",
  //   href: "/history",
  //   icon: History,
  // },
  // {
  //   title: "Transactions & Logs",
  //   href: "/transactions",
  //   icon: FileSpreadsheet,
  // },
  // {
  //   title: "Profile",
  //   href: "/profile",
  //   icon: UserCircle,
  // },
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



export async function getData() {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      datetime: "24-10-2024 14:30:00",
      user: "john_doe",
      module: "authentication",
      actionevent: "login_attempt",
      status: "success",
      details: "User logged in successfully",
      ipaddress: "192.168.1.100"
    },
    {
      id: 2,
      datetime: "24-10-2024 14:35:15",
      user: "jane_smith",
      module: "authentication",
      actionevent: "password_change",
      status: "success",
      details: "Password changed successfully",
      ipaddress: "192.168.1.101"
    },
    {
      id: 3,
      datetime: "24-10-2024 14:40:22",
      user: "michael_lee",
      module: "user_management",
      actionevent: "account_deactivated",
      status: "failed",
      details: "User does not have permission",
      ipaddress: "192.168.1.102"
    },
    {
      id: 4,
      datetime: "24-10-2024 14:45:10",
      user: "susan_kim",
      module: "reports",
      actionevent: "generate_report",
      status: "success",
      details: "Report generated: Sales Report Q3",
      ipaddress: "192.168.1.103"
    },
    {
      id: 5,
      datetime: "24-10-2024 14:50:05",
      user: "mark_jones",
      module: "authentication",
      actionevent: "login_attempt",
      status: "failed",
      details: "Incorrect password entered",
      ipaddress: "192.168.1.104"
    },
    {
      id: 6,
      datetime: "24-10-2024 14:55:30",
      user: "amy_wilson",
      module: "settings",
      actionevent: "update_preferences",
      status: "success",
      details: "Updated notification settings",
      ipaddress: "192.168.1.105"
    },
    {
      id: 7,
      datetime: "24-10-2024 15:00:45",
      user: "kevin_tan",
      module: "authentication",
      actionevent: "login_attempt",
      status: "success",
      details: "User logged in successfully",
      ipaddress: "192.168.1.106"
    },
    {
      id: 8,
      datetime: "24-10-2024 15:05:20",
      user: "linda_harris",
      module: "database",
      actionevent: "backup_created",
      status: "success",
      details: "Database backup completed",
      ipaddress: "192.168.1.107"
    },
    {
      id: 9,
      datetime: "24-10-2024 15:10:55",
      user: "robert_clark",
      module: "user_management",
      actionevent: "account_created",
      status: "success",
      details: "New user account created",
      ipaddress: "192.168.1.108"
    },
    {
      id: 10,
      datetime: "24-10-2024 15:15:10",
      user: "emma_brown",
      module: "finance",
      actionevent: "invoice_generated",
      status: "success",
      details: "Invoice #5678 generated",
      ipaddress: "192.168.1.109"
    },
    {
      id: 11,
      datetime: "24-10-2024 15:20:35",
      user: "oliver_martin",
      module: "authentication",
      actionevent: "password_reset",
      status: "success",
      details: "Password reset link sent",
      ipaddress: "192.168.1.110"
    },
    {
      id: 12,
      datetime: "24-10-2024 15:25:40",
      user: "chloe_evans",
      module: "settings",
      actionevent: "update_profile",
      status: "success",
      details: "Profile information updated",
      ipaddress: "192.168.1.111"
    },
    {
      id: 13,
      datetime: "24-10-2024 15:30:50",
      user: "ethan_wright",
      module: "reports",
      actionevent: "export_data",
      status: "success",
      details: "Exported sales data",
      ipaddress: "192.168.1.112"
    },
    {
      id: 14,
      datetime: "24-10-2024 15:35:25",
      user: "mia_rodriguez",
      module: "authentication",
      actionevent: "login_attempt",
      status: "failed",
      details: "User account locked due to multiple failed attempts",
      ipaddress: "192.168.1.113"
    },
    {
      id: 15,
      datetime: "24-10-2024 15:40:00",
      user: "daniel_moore",
      module: "database",
      actionevent: "restore_attempt",
      status: "failed",
      details: "Database restore failed due to missing files",
      ipaddress: "192.168.1.114"
    }
  ];
}