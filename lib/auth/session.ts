import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export interface SessionData {
  userId: string
  companyId: string
  role: string
  email: string
}

/**
 * Multi-tenant session enforcement
 * Returns session data with guaranteed companyId
 * Throws if session is invalid or expired
 */
export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session-token")?.value

  if (!sessionToken) {
    throw new Error("Unauthorized: No session token")
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          companyId: true,
        },
      },
    },
  })

  if (!session) {
    throw new Error("Unauthorized: Invalid session")
  }

  if (session.expiresAt < new Date()) {
    throw new Error("Unauthorized: Session expired")
  }

  if (!session.user.companyId) {
    throw new Error("Unauthorized: User not associated with a company")
  }

  // Return session data with guaranteed companyId
  return {
    userId: session.user.id,
    companyId: session.user.companyId,
    role: session.user.role,
    email: session.user.email,
  }
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  companyId: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<string> {
  const token = generateSecureToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await prisma.session.create({
    data: {
      userId,
      companyId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    },
  })

  return token
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({
    where: { token },
  })
}

/**
 * Generate a cryptographically secure token
 */
function generateSecureToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}
