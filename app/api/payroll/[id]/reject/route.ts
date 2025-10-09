import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { mockPayrollRuns } from "@/lib/mock-data"
import { PayrollStatus } from "@/lib/types/database"

const rejectSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    const body = await request.json()
    const { reason } = rejectSchema.parse(body)

    const payroll = mockPayrollRuns.find((pr) => pr.id === params.id)

    if (!payroll) {
      return NextResponse.json({ success: false, error: "Payroll run not found" }, { status: 404 })
    }

    if (payroll.status !== PayrollStatus.PENDING_APPROVAL) {
      return NextResponse.json({ success: false, error: "Payroll is not pending approval" }, { status: 400 })
    }

    // In production, this would:
    // 1. Update payroll status to REJECTED
    // 2. Create approval record with rejection reason
    // 3. Create audit log entry

    const updatedPayroll = {
      ...payroll,
      status: PayrollStatus.REJECTED,
      rejectedById: userId,
      rejectedAt: new Date(),
      rejectionReason: reason,
      updatedAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      data: updatedPayroll,
      message: "Payroll rejected successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    console.error("[v0] Error rejecting payroll:", error)
    return NextResponse.json({ success: false, error: "Failed to reject payroll" }, { status: 500 })
  }
}
