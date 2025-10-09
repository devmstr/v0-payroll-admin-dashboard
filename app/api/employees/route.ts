import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { mockEmployees } from "@/lib/mock-data"
import { EmploymentType, PaymentFrequency } from "@/lib/types/database"

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
})

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const department = searchParams.get("department")
    const status = searchParams.get("status")

    let filteredEmployees = mockEmployees

    // Filter by company
    if (companyId) {
      filteredEmployees = filteredEmployees.filter((emp) => emp.companyId === companyId)
    }

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

    return NextResponse.json({
      success: true,
      data: filteredEmployees,
      total: filteredEmployees.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching employees:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    if (!companyId) {
      return NextResponse.json({ success: false, error: "Company ID is required" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createEmployeeSchema.parse(body)

    // In production, this would create in database
    const newEmployee = {
      id: String(mockEmployees.length + 1),
      companyId,
      userId: null,
      ...validatedData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: newEmployee,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    console.error("[v0] Error creating employee:", error)
    return NextResponse.json({ success: false, error: "Failed to create employee" }, { status: 500 })
  }
}
