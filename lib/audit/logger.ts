import { prisma } from "@/lib/prisma"
import type { AuditAction } from "@prisma/client"

export interface AuditLogInput {
  companyId: string
  userId: string
  action: AuditAction
  entityType: string
  entityId: string
  changes?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

/**
 * Create an immutable audit log entry
 * CRITICAL: This must be called for all money-moving operations
 */
export async function createAuditLog(input: AuditLogInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      companyId: input.companyId,
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      changes: input.changes || {},
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  })
}

/**
 * Helper to capture before/after changes
 */
export function captureChanges<T extends Record<string, unknown>>(before: T, after: T): Record<string, unknown> {
  const changes: Record<string, unknown> = {}

  for (const key in after) {
    if (before[key] !== after[key]) {
      changes[key] = {
        before: before[key],
        after: after[key],
      }
    }
  }

  return changes
}

/**
 * Audit log wrapper for critical operations
 */
export async function withAuditLog<T>(
  auditInput: Omit<AuditLogInput, "changes">,
  operation: () => Promise<T>,
  captureResult?: (result: T) => Record<string, unknown>,
): Promise<T> {
  try {
    const result = await operation()

    await createAuditLog({
      ...auditInput,
      changes: captureResult ? captureResult(result) : undefined,
    })

    return result
  } catch (error) {
    // Log the failure
    await createAuditLog({
      ...auditInput,
      changes: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    })

    throw error
  }
}
