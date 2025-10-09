import { type NextRequest, NextResponse } from "next/server"
import { mockEmployees } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const employee = mockEmployees.find((emp) => emp.id === params.id)

    if (!employee) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: employee,
    })
  } catch (error) {
    console.error("[v0] Error fetching employee:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch employee" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const employee = mockEmployees.find((emp) => emp.id === params.id)

    if (!employee) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 })
    }

    // In production, this would update in database
    const updatedEmployee = {
      ...employee,
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: updatedEmployee,
    })
  } catch (error) {
    console.error("[v0] Error updating employee:", error)
    return NextResponse.json({ success: false, error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const employee = mockEmployees.find((emp) => emp.id === params.id)

    if (!employee) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 })
    }

    // In production, this would soft delete in database
    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting employee:", error)
    return NextResponse.json({ success: false, error: "Failed to delete employee" }, { status: 500 })
  }
}
