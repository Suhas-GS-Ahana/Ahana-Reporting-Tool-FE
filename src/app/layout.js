"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { Sidebar } from "@/components/Sidebar"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"
import { ConnectionProvider } from "@/contexts/ConnectionContext"

const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "ETL Reporting Tool",
//   description: "Data transformation and reporting made easy",
// }


export default function Layout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ConnectionProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <AdminHeader />
            <div className="flex">
              {isAdmin ? <AdminSidebar /> : <Sidebar />}
              <main className="flex-1 p-6 transition-all duration-300 ease-in-out">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
          </ConnectionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}