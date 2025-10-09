import { type NextRequest, NextResponse } from "next/server"
import { mockPayrollRuns } from "@/lib/mock-data"
import { PayrollStatus } from "@/lib/types/database"

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    const searchParams = request.nextUrl.searchParams
    const priority = searchParams.get("priority")

    // Get all payrolls pending approval
    let pendingApprovals = mockPayrollRuns.filter((pr) => pr.status === PayrollStatus.PENDING_APPROVAL)

    // Filter by company
    if (companyId) {
      pendingApprovals = pendingApprovals.filter((pr) => pr.companyId === companyId)
    }

    // Sort by priority (payment date)
    pendingApprovals.sort((a, b) => {
      return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
    })

    return NextResponse.json({
      success: true,
      data: pendingApprovals,
      total: pendingApprovals.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching approvals:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch approvals" }, { status: 500 })
  }
}
