import { NextResponse } from "next/server"

export function middleware(request) {
  const user = request.cookies.get("user")
  const isPublicPath = request.nextUrl.pathname === "/auth/login"

  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (user && isPublicPath) {
    return NextResponse.redirect(new URL("/configurations", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/login", "/new-process", "/history", "/transactions", "/configurations", "/profile"],
}

