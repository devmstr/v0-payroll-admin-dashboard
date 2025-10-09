import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { mockPayrollRuns } from "@/lib/mock-data"
import { PayrollStatus } from "@/lib/types/database"

const createPayrollSchema = z.object({
  name: z.string().min(1, "Payroll name is required"),
  periodStart: z.string().transform((str) => new Date(str)),
  periodEnd: z.string().transform((str) => new Date(str)),
  paymentDate: z.string().transform((str) => new Date(str)),
  isDryRun: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    let filteredPayrolls = mockPayrollRuns

    // Filter by company
    if (companyId) {
      filteredPayrolls = filteredPayrolls.filter((pr) => pr.companyId === companyId)
    }

    // Filter by status
    if (status && status !== "all") {
      filteredPayrolls = filteredPayrolls.filter((pr) => pr.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredPayrolls,
      total: filteredPayrolls.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching payroll runs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payroll runs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    const userId = request.headers.get("x-user-id")

    if (!companyId || !userId) {
      return NextResponse.json({ success: false, error: "Company ID and User ID are required" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createPayrollSchema.parse(body)

    // In production, this would create in database and trigger calculation worker
    const newPayroll = {
      id: String(mockPayrollRuns.length + 1),
      companyId,
      ...validatedData,
      status: PayrollStatus.DRAFT,
      totalGross: 0,
      totalNet: 0,
      totalTax: 0,
      totalDeductions: 0,
      currency: "USD",
      createdById: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: newPayroll,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    console.error("[v0] Error creating payroll run:", error)
    return NextResponse.json({ success: false, error: "Failed to create payroll run" }, { status: 500 })
  }
}
