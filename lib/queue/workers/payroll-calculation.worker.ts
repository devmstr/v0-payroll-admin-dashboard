import { Worker, type Job } from "bullmq"
import { prisma } from "@/lib/prisma"
import { calculatePayroll } from "@/lib/services/payroll-calculator"
import { createAuditLog } from "@/lib/audit/logger"
import { QUEUE_NAMES } from "../config"
import { Redis } from "ioredis"
import Decimal from "decimal.js"

interface PayrollCalculationJob {
  payrollRunId: string
  companyId: string
  userId: string
}

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
})

/**
 * Worker for calculating payroll asynchronously
 * Handles heavy computation without blocking API routes
 */
export const payrollCalculationWorker = new Worker<PayrollCalculationJob>(
  QUEUE_NAMES.PAYROLL_CALCULATION,
  async (job: Job<PayrollCalculationJob>) => {
    const { payrollRunId, companyId, userId } = job.data

    console.log(`[v0] Calculating payroll run: ${payrollRunId}`)

    try {
      // Fetch payroll run and employees
      const payrollRun = await prisma.payrollRun.findUnique({
        where: { id: payrollRunId },
        include: {
          company: true,
        },
      })

      if (!payrollRun) {
        throw new Error(`Payroll run ${payrollRunId} not found`)
      }

      // Fetch active employees
      const employees = await prisma.employee.findMany({
        where: {
          companyId,
          status: "ACTIVE",
        },
      })

      console.log(`[v0] Processing ${employees.length} employees`)

      // Calculate payroll for each employee
      const payrollItems = []
      let totalGross = new Decimal(0)
      let totalDeductions = new Decimal(0)
      let totalNet = new Decimal(0)
      let totalTax = new Decimal(0)

      for (const employee of employees) {
        const result = calculatePayroll({
          baseSalary: new Decimal(employee.baseSalary.toString()),
          taxFilingStatus: (employee.taxFilingStatus as any) || "single",
          taxAllowances: employee.taxAllowances,
          stateCode: employee.state || "CA",
        })

        payrollItems.push({
          payrollRunId,
          employeeId: employee.id,
          basePay: result.basePay.toFixed(2),
          overtime: result.overtime.toFixed(2),
          bonus: result.bonus.toFixed(2),
          commission: result.commission.toFixed(2),
          allowances: result.allowances.toFixed(2),
          federalTax: result.federalTax.toFixed(2),
          stateTax: result.stateTax.toFixed(2),
          socialSecurity: result.socialSecurity.toFixed(2),
          medicare: result.medicare.toFixed(2),
          healthInsurance: result.healthInsurance.toFixed(2),
          retirement401k: result.retirement401k.toFixed(2),
          otherDeductions: result.otherDeductions.toFixed(2),
          grossPay: result.grossPay.toFixed(2),
          totalDeductions: result.totalDeductions.toFixed(2),
          netPay: result.netPay.toFixed(2),
        })

        totalGross = totalGross.plus(result.grossPay)
        totalDeductions = totalDeductions.plus(result.totalDeductions)
        totalNet = totalNet.plus(result.netPay)
        totalTax = totalTax.plus(result.federalTax).plus(result.stateTax)
      }

      // Save payroll items in transaction
      await prisma.$transaction([
        // Delete existing items (for recalculation)
        prisma.payrollItem.deleteMany({
          where: { payrollRunId },
        }),

        // Create new items
        prisma.payrollItem.createMany({
          data: payrollItems,
        }),

        // Update payroll run totals
        prisma.payrollRun.update({
          where: { id: payrollRunId },
          data: {
            totalGross: totalGross.toFixed(2),
            totalDeductions: totalDeductions.toFixed(2),
            totalNet: totalNet.toFixed(2),
            totalTax: totalTax.toFixed(2),
            employeeCount: employees.length,
            status: "PENDING_APPROVAL",
            processedAt: new Date(),
          },
        }),
      ])

      // Audit log
      await createAuditLog({
        companyId,
        userId,
        action: "UPDATE",
        entityType: "PayrollRun",
        entityId: payrollRunId,
        changes: {
          status: "PENDING_APPROVAL",
          employeeCount: employees.length,
          totalNet: totalNet.toFixed(2),
        },
      })

      console.log(`[v0] Payroll run ${payrollRunId} calculated successfully`)

      return {
        employeeCount: employees.length,
        totalNet: totalNet.toFixed(2),
      }
    } catch (error) {
      console.error(`[v0] Payroll calculation failed:`, error)

      // Update payroll run status to failed
      await prisma.payrollRun.update({
        where: { id: payrollRunId },
        data: { status: "FAILED" },
      })

      throw error
    }
  },
  {
    connection,
    concurrency: 2, // Process 2 payroll runs concurrently
  },
)

// Worker event handlers
payrollCalculationWorker.on("completed", (job) => {
  console.log(`[v0] Payroll calculation job ${job.id} completed`)
})

payrollCalculationWorker.on("failed", (job, err) => {
  console.error(`[v0] Payroll calculation job ${job?.id} failed:`, err)
})
