import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ETL Reporting Tool",
  description: "Data transformation and reporting made easy",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
        <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

