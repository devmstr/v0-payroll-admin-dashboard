import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { mockPayrollRuns, mockEmployees } from "@/lib/mock-data"
import { PayrollStatus } from "@/lib/types/database"
import { calculatePayroll } from "@/lib/services/payroll-calculator"
import { createAuditLog } from "@/lib/audit/logger"
import Decimal from "decimal.js"

const createPayrollSchema = z.object({
  name: z.string().min(1, "Payroll name is required"),
  periodStart: z.string().transform((str) => new Date(str)),
  periodEnd: z.string().transform((str) => new Date(str)),
  paymentDate: z.string().transform((str) => new Date(str)),
  isDryRun: z.boolean().default(false),
  employeeIds: z.array(z.string()).optional(), // Optional: specific employees
})

/**
 * GET /api/payroll-runs
 * List payroll runs with status filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    const userId = request.headers.get("x-user-id")

    if (!companyId || !userId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing session" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filteredPayrolls = mockPayrollRuns

    // Filter by company (CRITICAL: Always scope by company)
    filteredPayrolls = filteredPayrolls.filter((pr) => pr.companyId === companyId)

    // Filter by status
    if (status && status !== "all") {
      filteredPayrolls = filteredPayrolls.filter((pr) => pr.status === status)
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate)
      filteredPayrolls = filteredPayrolls.filter((pr) => new Date(pr.periodStart) >= start)
    }

    if (endDate) {
      const end = new Date(endDate)
      filteredPayrolls = filteredPayrolls.filter((pr) => new Date(pr.periodEnd) <= end)
    }

    const total = filteredPayrolls.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedPayrolls = filteredPayrolls.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedPayrolls,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching payroll runs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payroll runs" }, { status: 500 })
  }
}

/**
 * POST /api/payroll-runs
 * Create new payroll run with dry-run logic
 */
export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (!companyId || !userId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing session" }, { status: 401 })
    }

    // Role-based authorization
    if (userRole !== "admin" && userRole !== "payroll_admin") {
      return NextResponse.json({ success: false, error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createPayrollSchema.parse(body)

    let employees = mockEmployees.filter((emp) => emp.companyId === companyId && emp.isActive)

    // Filter by specific employee IDs if provided
    if (validatedData.employeeIds && validatedData.employeeIds.length > 0) {
      employees = employees.filter((emp) => validatedData.employeeIds!.includes(emp.id))
    }

    const payslips = employees.map((emp) => {
      const calculation = calculatePayroll({
        baseSalary: new Decimal(emp.baseSalary),
        taxFilingStatus: "single",
        taxAllowances: 1,
        stateCode: "CA",
      })

      return {
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        basePay: calculation.basePay.toNumber(),
        grossPay: calculation.grossPay.toNumber(),
        totalDeductions: calculation.totalDeductions.toNumber(),
        netPay: calculation.netPay.toNumber(),
        breakdown: {
          federalTax: calculation.federalTax.toNumber(),
          stateTax: calculation.stateTax.toNumber(),
          socialSecurity: calculation.socialSecurity.toNumber(),
          medicare: calculation.medicare.toNumber(),
        },
      }
    })

    // Calculate totals
    const totalGross = payslips.reduce((sum, p) => sum + p.grossPay, 0)
    const totalNet = payslips.reduce((sum, p) => sum + p.netPay, 0)
    const totalDeductions = payslips.reduce((sum, p) => sum + p.totalDeductions, 0)

    if (validatedData.isDryRun) {
      return NextResponse.json({
        success: true,
        isDryRun: true,
        preview: {
          ...validatedData,
          totalGross,
          totalNet,
          totalDeductions,
          employeeCount: employees.length,
          payslips,
        },
        message: "Dry-run completed. Review the preview before creating the actual payroll run.",
      })
    }

    const newPayroll = {
      id: String(mockPayrollRuns.length + 1),
      companyId,
      ...validatedData,
      status: PayrollStatus.DRAFT,
      totalGross,
      totalNet,
      totalTax: totalDeductions,
      totalDeductions,
      currency: "USD",
      createdById: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await createAuditLog({
      companyId,
      userId,
      action: "CREATE",
      entityType: "PayrollRun",
      entityId: newPayroll.id,
      changes: {
        created: {
          ...validatedData,
          totalGross,
          totalNet,
          employeeCount: employees.length,
        },
      },
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    // await payrollCalculationQueue.add('calculate-payroll', { payrollRunId: newPayroll.id })

    return NextResponse.json(
      {
        success: true,
        data: newPayroll,
        payslips,
        message: "Payroll run created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    console.error("[v0] Error creating payroll run:", error)
    return NextResponse.json({ success: false, error: "Failed to create payroll run" }, { status: 500 })
  }
}
