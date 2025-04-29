"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, Menu } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

export function Header() {
  const { user, logout, toggleSidebar } = useAuth();

  return (
    <div className="sticky top-0 left-0 z-50 bg-blue-600 drop-shadow-lg">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-4 hover:bg-blue-700"
        >
          <Menu className=" text-white size={35}" />
        </Button>
        <Link href="/home" className="flex items-center gap-2">
          <Image
            src="/logo1.png" 
            alt="Ahana Logo"
            width={100}
            height={100}
          />
          <h1 className="text-gray-100 text-xl font-medium">OMPD Reporting Tool</h1>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-blue-700">
                  <UserCircle className="h-5 w-5 text-white" />
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
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
