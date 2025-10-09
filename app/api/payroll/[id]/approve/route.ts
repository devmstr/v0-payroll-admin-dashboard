import { type NextRequest, NextResponse } from "next/server"
import { mockPayrollRuns } from "@/lib/mock-data"
import { PayrollStatus } from "@/lib/types/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    const payroll = mockPayrollRuns.find((pr) => pr.id === params.id)

    if (!payroll) {
      return NextResponse.json({ success: false, error: "Payroll run not found" }, { status: 404 })
    }

    if (payroll.status !== PayrollStatus.PENDING_APPROVAL) {
      return NextResponse.json({ success: false, error: "Payroll is not pending approval" }, { status: 400 })
    }

    // In production, this would:
    // 1. Update payroll status to APPROVED
    // 2. Create approval record
    // 3. Trigger disbursement worker
    // 4. Create audit log entry

    const updatedPayroll = {
      ...payroll,
      status: PayrollStatus.APPROVED,
      approvedById: userId,
      approvedAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: updatedPayroll,
      message: "Payroll approved successfully",
    })
  } catch (error) {
    console.error("[v0] Error approving payroll:", error)
    return NextResponse.json({ success: false, error: "Failed to approve payroll" }, { status: 500 })
  }
}
