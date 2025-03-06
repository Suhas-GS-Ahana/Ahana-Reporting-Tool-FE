"use client"

import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Sidebar } from "@/components/Sidebar"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"
import { ConnectionProvider } from "@/contexts/ConnectionContext"

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <AuthProvider>
      <ConnectionProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <AdminHeader />
          <div className="flex">
            {isAdmin ? <AdminSidebar /> : <Sidebar />}
            <main className="flex-1 p-6 transition-all duration-300 ease-in-out">{children}</main>
          </div>
        </div>
        <Toaster />
      </ConnectionProvider>
    </AuthProvider>
  )
}

