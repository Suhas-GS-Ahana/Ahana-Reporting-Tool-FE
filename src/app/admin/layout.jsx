import { Inter } from "next/font/google"
import "../globals.css"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Admin - ETL Reporting Tool",
  description: "Admin dashboard for ETL Reporting Tool",
}

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <AdminHeader />
            <div className="flex">
              <AdminSidebar />
              <main className="flex-1 p-6 transition-all duration-300 ease-in-out">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
} 