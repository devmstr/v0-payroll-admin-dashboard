import { Worker, type Job } from "bullmq"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit/logger"
import { QUEUE_NAMES } from "../config"
import { Redis } from "ioredis"

interface BankDisbursementJob {
  transferId: string
  companyId: string
  userId: string
}

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
})

/**
 * Worker for processing bank disbursements asynchronously
 * CRITICAL: Never do synchronous HTTP calls to banks in API routes
 */
export const bankDisbursementWorker = new Worker<BankDisbursementJob>(
  QUEUE_NAMES.BANK_DISBURSEMENT,
  async (job: Job<BankDisbursementJob>) => {
    const { transferId, companyId, userId } = job.data

    console.log(`[v0] Processing bank transfer: ${transferId}`)

    try {
      // Fetch transfer details
      const transfer = await prisma.bankTransfer.findUnique({
        where: { id: transferId },
        include: {
          employee: true,
          company: true,
        },
      })

      if (!transfer) {
        throw new Error(`Transfer ${transferId} not found`)
      }

      // Update status to processing
      await prisma.bankTransfer.update({
        where: { id: transferId },
        data: { status: "PROCESSING", processedAt: new Date() },
      })

      // Call bank API (mock implementation)
      const result = await processBankTransfer(transfer)

      // Update transfer status
      await prisma.bankTransfer.update({
        where: { id: transferId },
        data: {
          status: result.success ? "COMPLETED" : "FAILED",
          referenceNumber: result.referenceNumber,
          failureReason: result.failureReason,
          completedAt: result.success ? new Date() : null,
        },
      })

      // Audit log
      await createAuditLog({
        companyId,
        userId,
        action: "UPDATE",
        entityType: "BankTransfer",
        entityId: transferId,
        changes: {
          status: result.success ? "COMPLETED" : "FAILED",
          referenceNumber: result.referenceNumber,
        },
      })

      console.log(`[v0] Transfer ${transferId} completed: ${result.success}`)

      return result
    } catch (error) {
      console.error(`[v0] Transfer ${transferId} failed:`, error)

      // Update transfer status to failed
      await prisma.bankTransfer.update({
        where: { id: transferId },
        data: {
          status: "FAILED",
          failureReason: error instanceof Error ? error.message : "Unknown error",
          retriedCount: { increment: 1 },
        },
      })

      // Audit log
      await createAuditLog({
        companyId,
        userId,
        action: "UPDATE",
        entityType: "BankTransfer",
        entityId: transferId,
        changes: {
          status: "FAILED",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      })

      throw error
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 transfers concurrently
  },
)

/**
 * Mock bank API call
 * In production, integrate with actual bank APIs (Plaid, Stripe, etc.)
 */
async function processBankTransfer(transfer: {
  id: string
  amount: any
  bankName: string
  accountNumber: string
  routingNumber: string
}): Promise<{
  success: boolean
  referenceNumber?: string
  failureReason?: string
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock success/failure (90% success rate)
  const success = Math.random() > 0.1

  if (success) {
    return {
      success: true,
      referenceNumber: `REF-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    }
  } else {
    return {
      success: false,
      failureReason: "Insufficient funds in company account",
    }
  }
}

// Worker event handlers
bankDisbursementWorker.on("completed", (job) => {
  console.log(`[v0] Job ${job.id} completed`)
})

bankDisbursementWorker.on("failed", (job, err) => {
  console.error(`[v0] Job ${job?.id} failed:`, err)
})

bankDisbursementWorker.on("error", (err) => {
  console.error("[v0] Worker error:", err)
})
