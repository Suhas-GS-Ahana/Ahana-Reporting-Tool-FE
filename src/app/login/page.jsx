import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2.5">
                <label>Email</label>
                <Input id="email" placeholder="Enter Email" type="email" />
              </div>
              <div className="flex flex-col space-y-2.5">
              <label>Password</label>
                <Input id="password" placeholder="Enter Password" type="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full bg-blue-950">Login</Button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

