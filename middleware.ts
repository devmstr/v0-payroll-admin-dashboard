import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Multi-tenant middleware
 * Enforces session → companyId mapping for all API routes
 */
export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Skip auth routes
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Get session token from cookie
  const sessionToken = request.cookies.get("session-token")?.value

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized: No session token" }, { status: 401 })
  }

  // Validate session and get companyId
  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: {
      user: {
        select: {
          id: true,
          companyId: true,
          role: true,
        },
      },
    },
  })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 401 })
  }

  if (session.expiresAt < new Date()) {
    return NextResponse.json({ error: "Unauthorized: Session expired" }, { status: 401 })
  }

  if (!session.user.companyId) {
    return NextResponse.json({ error: "Unauthorized: User not associated with a company" }, { status: 403 })
  }

  // Add session data to request headers for API routes to use
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", session.user.id)
  requestHeaders.set("x-company-id", session.user.companyId)
  requestHeaders.set("x-user-role", session.user.role)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: "/api/:path*",
}
