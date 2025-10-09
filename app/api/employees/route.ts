import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { mockEmployees } from "@/lib/mock-data"
import { EmploymentType, PaymentFrequency } from "@/lib/types/database"
import { createAuditLog } from "@/lib/audit/logger"

const createEmployeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  employeeId: z.string().min(1, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  employmentType: z.nativeEnum(EmploymentType),
  hireDate: z.string().transform((str) => new Date(str)),
  baseSalary: z.number().positive("Salary must be positive"),
  currency: z.string().length(3, "Currency must be 3 characters"),
  paymentFrequency: z.nativeEnum(PaymentFrequency),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  taxNumber: z.string().optional(),
  // Salary structure
  allowances: z.number().optional(),
  overtimeRate: z.number().optional(),
  healthInsurancePremium: z.number().optional(),
  retirement401kPercent: z.number().optional(),
  taxFilingStatus: z.enum(["single", "married", "head_of_household"]).optional(),
  taxAllowances: z.number().optional(),
  stateCode: z.string().optional(),
})

/**
 * GET /api/employees
 * List employees with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    // Authorization check
    if (!companyId || !userId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing session" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const department = searchParams.get("department")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    let filteredEmployees = mockEmployees

    // Filter by company (CRITICAL: Always scope by company)
    filteredEmployees = filteredEmployees.filter((emp) => emp.companyId === companyId)

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      filteredEmployees = filteredEmployees.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(searchLower) ||
          emp.lastName.toLowerCase().includes(searchLower) ||
          emp.email.toLowerCase().includes(searchLower) ||
          emp.employeeId.toLowerCase().includes(searchLower),
      )
    }

    // Filter by department
    if (department && department !== "all") {
      filteredEmployees = filteredEmployees.filter((emp) => emp.department === department)
    }

    // Filter by status
    if (status === "active") {
      filteredEmployees = filteredEmployees.filter((emp) => emp.isActive)
    } else if (status === "inactive") {
      filteredEmployees = filteredEmployees.filter((emp) => !emp.isActive)
    }

    const total = filteredEmployees.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedEmployees = filteredEmployees.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedEmployees,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching employees:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch employees" }, { status: 500 })
  }
}

/**
 * POST /api/employees
 * Create new employee with initial salary structure
 */
export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")

    // Authorization check
    if (!companyId || !userId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing session" }, { status: 401 })
    }

    // Role-based authorization
    if (userRole !== "admin" && userRole !== "payroll_admin") {
      return NextResponse.json({ success: false, error: "Forbidden: Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createEmployeeSchema.parse(body)

    const newEmployee = {
      id: String(mockEmployees.length + 1),
      companyId,
      userId: null,
      ...validatedData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await createAuditLog({
      companyId,
      userId,
      action: "CREATE",
      entityType: "Employee",
      entityId: newEmployee.id,
      changes: {
        created: validatedData,
      },
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    return NextResponse.json(
      {
        success: true,
        data: newEmployee,
        message: "Employee created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    console.error("[v0] Error creating employee:", error)
    return NextResponse.json({ success: false, error: "Failed to create employee" }, { status: 500 })
  }
}
