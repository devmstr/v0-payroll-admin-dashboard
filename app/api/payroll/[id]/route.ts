import { type NextRequest, NextResponse } from "next/server"
import { mockPayrollRuns } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payroll = mockPayrollRuns.find((pr) => pr.id === params.id)

    if (!payroll) {
      return NextResponse.json({ success: false, error: "Payroll run not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: payroll,
    })
  } catch (error) {
    console.error("[v0] Error fetching payroll run:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payroll run" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const payroll = mockPayrollRuns.find((pr) => pr.id === params.id)

    if (!payroll) {
      return NextResponse.json({ success: false, error: "Payroll run not found" }, { status: 404 })
    }

    // In production, this would update in database
    const updatedPayroll = {
      ...payroll,
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: updatedPayroll,
    })
  } catch (error) {
    console.error("[v0] Error updating payroll run:", error)
    return NextResponse.json({ success: false, error: "Failed to update payroll run" }, { status: 500 })
  }
}
