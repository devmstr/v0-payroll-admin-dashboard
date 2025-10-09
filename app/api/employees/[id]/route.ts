import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { mockEmployees } from "@/lib/mock-data"
import { createAuditLog, captureChanges } from "@/lib/audit/logger"

const updateEmployeeSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  department: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  baseSalary: z.number().positive().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  taxNumber: z.string().optional(),
  // Salary structure updates
  allowances: z.number().optional(),
  overtimeRate: z.number().optional(),
  healthInsurancePremium: z.number().optional(),
  retirement401kPercent: z.number().optional(),
  taxFilingStatus: z.enum(["single", "married", "head_of_household"]).optional(),
  taxAllowances: z.number().optional(),
  stateCode: z.string().optional(),
})

/**
 * GET /api/employees/:id
 * Fetch single employee with salary structure, benefits, deductions, bank info
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const companyId = request.headers.get("x-company-id")
    const userId = request.headers.get("x-user-id")

    if (!companyId || !userId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing session" }, { status: 401 })
    }

    const employee = mockEmployees.find((emp) => emp.id === params.id && emp.companyId === companyId)

    if (!employee) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 })
    }

    const enrichedEmployee = {
      ...employee,
      salaryStructure: {
        baseSalary: employee.baseSalary,
        currency: employee.currency,
        paymentFrequency: employee.paymentFrequency,
        allowances: 0,
        overtimeRate: 0,
        effectiveDate: employee.hireDate,
      },
      benefits: [],
      deductions: [],
      bankInfo: {
        accountNumber: employee.bankAccountNumber,
        bankName: employee.bankName,
      },
    }

    return NextResponse.json({
      success: true,
      data: enrichedEmployee,
    })
  } catch (error) {
    console.error("[v0] Error fetching employee:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch employee" }, { status: 500 })
  }
}

/**
 * PUT /api/employees/:id
 * Update employee with salary structure versioning
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const validatedData = updateEmployeeSchema.parse(body)

    const employee = mockEmployees.find((emp) => emp.id === params.id && emp.companyId === companyId)

    if (!employee) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 })
    }

    const changes = captureChanges(employee, { ...employee, ...validatedData })

    const salaryChanged = validatedData.baseSalary && validatedData.baseSalary !== employee.baseSalary

    if (salaryChanged) {
      // In production: Create new salary structure version
      console.log("[v0] Salary changed, creating new version")
    }

    // In production, this would update in database
    const updatedEmployee = {
      ...employee,
      ...validatedData,
      updatedAt: new Date(),
    }

    await createAuditLog({
      companyId,
      userId,
      action: "UPDATE",
      entityType: "Employee",
      entityId: params.id,
      changes,
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({
      success: true,
      data: updatedEmployee,
      message: "Employee updated successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    console.error("[v0] Error updating employee:", error)
    return NextResponse.json({ success: false, error: "Failed to update employee" }, { status: 500 })
  }
}

/**
 * DELETE /api/employees/:id
 * Soft delete employee and invalidate future payroll eligibility
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const companyId = request.headers.get("x-company-id")
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    if (!companyId || !userId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing session" }, { status: 401 })
    }

    // Role-based authorization
    if (userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only admins can delete employees" },
        { status: 403 },
      )
    }

    const employee = mockEmployees.find((emp) => emp.id === params.id && emp.companyId === companyId)

    if (!employee) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 })
    }

    // In production: Update employee.isActive = false, employee.terminationDate = now
    // Also invalidate future payroll eligibility

    await createAuditLog({
      companyId,
      userId,
      action: "DELETE",
      entityType: "Employee",
      entityId: params.id,
      changes: {
        terminated: true,
        terminationDate: new Date(),
      },
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({
      success: true,
      message: "Employee terminated successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting employee:", error)
    return NextResponse.json({ success: false, error: "Failed to delete employee" }, { status: 500 })
  }
}
