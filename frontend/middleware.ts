import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/login", "/register", "/admin/login"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login"

  // User protected routes
  const isUserRoute = ["/dashboard", "/deposit", "/withdraw", "/transactions"].some((route) =>
    pathname.startsWith(route),
  )

  // If no token and trying to access protected route, redirect to login
  if (!token && (isUserRoute || isAdminRoute)) {
    const loginUrl = isAdminRoute ? "/admin/login" : "/login"
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  // If has token and trying to access login pages, redirect to dashboard
  if (token && isPublicRoute) {
    const dashboardUrl = pathname === "/admin/login" ? "/admin/dashboard" : "/dashboard"
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/deposit",
    "/withdraw",
    "/transactions/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
}
