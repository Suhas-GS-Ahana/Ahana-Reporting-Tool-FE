import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get the user from your auth context/session
  const user = request.cookies.get('user') // Example: get user from cookies
  
  // Check if user is admin
  if (!user || !user.isAdmin) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 