'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserCircle, Menu } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Header() {

  const {user, logout, toggleSidebar, } = useAuth()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
          <Menu className="h-5 w-5" />
      </Button>
        <Link href="/configurations" className="flex items-center gap-2">
          <img
            src="https://ahanait.com/wp-content/uploads/2024/02/New1-Ahana-2024-website-Logo-Medium.svg"
            alt="Ahana Logo"
            className="h-12"
          />
        </Link>
        <div className="ml-auto flex items-center gap-4">
          {user ?  ( 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          )}
        </div>
      </div>
    </div>
  )
}

