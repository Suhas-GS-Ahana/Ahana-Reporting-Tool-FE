import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
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
                <Input id="password" placeholder="Enter Password" type="password" />
              </div>
              <div className="flex flex-col space-y-1.5">
              <label>Confirm Password</label>
                <Input id="confirm-password" placeholder="Enter Confirm Password" type="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full bg-blue-950">Sign Up</Button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}