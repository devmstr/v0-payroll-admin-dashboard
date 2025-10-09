import { Queue, QueueEvents } from "bullmq"
import { Redis } from "ioredis"

// Redis connection configuration
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
})

// Queue names
export const QUEUE_NAMES = {
  BANK_DISBURSEMENT: "bank-disbursement",
  PAYROLL_CALCULATION: "payroll-calculation",
  TAX_FILING: "tax-filing",
  REPORT_GENERATION: "report-generation",
} as const

// Create queues
export const bankDisbursementQueue = new Queue(QUEUE_NAMES.BANK_DISBURSEMENT, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 3600, // 24 hours
    },
    removeOnFail: {
      count: 500,
      age: 7 * 24 * 3600, // 7 days
    },
  },
})

export const payrollCalculationQueue = new Queue(QUEUE_NAMES.PAYROLL_CALCULATION, {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "fixed",
      delay: 3000,
    },
  },
})

// Queue events for monitoring
export const bankDisbursementEvents = new QueueEvents(QUEUE_NAMES.BANK_DISBURSEMENT, {
  connection,
})

export const payrollCalculationEvents = new QueueEvents(QUEUE_NAMES.PAYROLL_CALCULATION, {
  connection,
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  await bankDisbursementQueue.close()
  await payrollCalculationQueue.close()
  await connection.quit()
})
