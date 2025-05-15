// Sets the Header & Sidebar to render on admin & main page
// Has 2 context providers - AuthProvider & ConnectionProvider

"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Header } from "./Header";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ClientLayout({ children }) {

  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const { sidebarExpanded } = useAuth();

  return (
    <AuthProvider>
      <ConnectionProvider>
        <div className="min-h-screen flex flex-col bg-background">
          {isAdmin ? <AdminHeader /> : <Header />}
          <div className="flex flex-1 overflow-hidden">
            {isAdmin ? <AdminSidebar /> : <Sidebar />}
            <main
              className={cn(
                "p-6  overflow-y-auto transition-all duration-300 ease-in-out ",
                sidebarExpanded
                  ? "ml-50 w-[calc(100%-12.5rem)]"
                  : "ml-16 w-[calc(100%-4rem)]"
              )}
            >
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </ConnectionProvider>
    </AuthProvider>
  );
}
