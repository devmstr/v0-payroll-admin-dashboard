import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { mockCompanies } from "@/lib/mock-data"

const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  currency: z.string().length(3, "Currency must be 3 characters"),
  country: z.string().length(2, "Country must be 2 characters"),
  address: z.string().min(1, "Address is required"),
})

export async function GET(request: NextRequest) {
  try {
    // In production, this would query the database with company scoping
    // const companyId = request.headers.get("x-company-id")

    return NextResponse.json({
      success: true,
      data: mockCompanies,
    })
  } catch (error) {
    console.error("[v0] Error fetching companies:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch companies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCompanySchema.parse(body)

    // In production, this would create in database
    const newCompany = {
      id: String(mockCompanies.length + 1),
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: newCompany,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    console.error("[v0] Error creating company:", error)
    return NextResponse.json({ success: false, error: "Failed to create company" }, { status: 500 })
  }
}
