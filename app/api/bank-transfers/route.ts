import { type NextRequest, NextResponse } from "next/server"

// Mock bank transfer data
const mockBankTransfers = [
  {
    id: "1",
    payrollRunId: "1",
    employeeId: "1",
    amount: 8500.0,
    currency: "USD",
    status: "completed",
    bankAccountNumber: "****1234",
    bankName: "Chase Bank",
    transactionId: "TXN-2024-001",
    initiatedAt: new Date("2024-04-01T10:00:00Z"),
    completedAt: new Date("2024-04-01T10:05:00Z"),
  },
  {
    id: "2",
    payrollRunId: "1",
    employeeId: "2",
    amount: 7200.0,
    currency: "USD",
    status: "pending",
    bankAccountNumber: "****5678",
    bankName: "Bank of America",
    transactionId: "TXN-2024-002",
    initiatedAt: new Date("2024-04-01T10:00:00Z"),
  },
  {
    id: "3",
    payrollRunId: "2",
    employeeId: "1",
    amount: 8500.0,
    currency: "USD",
    status: "failed",
    bankAccountNumber: "****1234",
    bankName: "Chase Bank",
    transactionId: "TXN-2024-003",
    failureReason: "Insufficient funds in company account",
    initiatedAt: new Date("2024-03-01T10:00:00Z"),
    failedAt: new Date("2024-03-01T10:02:00Z"),
  },
]

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id")
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    let filteredTransfers = mockBankTransfers

    // Filter by status
    if (status && status !== "all") {
      filteredTransfers = filteredTransfers.filter((t) => t.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredTransfers,
      total: filteredTransfers.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching bank transfers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bank transfers" }, { status: 500 })
  }
}
