"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[480px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
          <CardDescription className="text-center">Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <label>Full Name</label>
                <Input id="name" placeholder="Enter Full Name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label>Email</label>
                <Input id="email" placeholder="Enter Email" type="email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label>Password</label>
                <div className="relative">
                  <Input id="password" placeholder="Enter Password" type={showPassword ? "text" : "password"} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label>Confirm Password</label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    placeholder="Enter Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full bg-blue-950">Sign Up</Button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

