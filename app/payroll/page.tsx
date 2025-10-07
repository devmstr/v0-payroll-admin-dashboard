import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { PayrollRunTable } from "@/components/payroll-run-table"
import { mockPayrollRuns } from "@/lib/mock-data"
import { PayrollStatus } from "@/lib/types/database"

export default function PayrollPage() {
  // Generate more mock payroll runs
  const allPayrollRuns = [
    ...mockPayrollRuns,
    {
      id: "3",
      companyId: "1",
      name: "February 2024 Payroll",
      periodStart: new Date("2024-02-01"),
      periodEnd: new Date("2024-02-29"),
      paymentDate: new Date("2024-03-01"),
      status: PayrollStatus.DISBURSED,
      totalGross: 2398450,
      totalNet: 1798837,
      totalTax: 479690,
      totalDeductions: 119923,
      currency: "USD",
      isDryRun: false,
      createdById: "1",
      createdAt: new Date("2024-02-25"),
      updatedAt: new Date("2024-03-01"),
    },
    {
      id: "4",
      companyId: "1",
      name: "January 2024 Payroll",
      periodStart: new Date("2024-01-01"),
      periodEnd: new Date("2024-01-31"),
      paymentDate: new Date("2024-02-01"),
      status: PayrollStatus.DISBURSED,
      totalGross: 2412330,
      totalNet: 1809247,
      totalTax: 482466,
      totalDeductions: 120617,
      currency: "USD",
      isDryRun: false,
      createdById: "1",
      createdAt: new Date("2024-01-25"),
      updatedAt: new Date("2024-02-01"),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Payroll Runs</h1>
          <p className="text-muted-foreground mt-1">Create and manage payroll processing cycles</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Payroll Run
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input type="search" placeholder="Search payroll runs..." className="pl-9 bg-muted/50 border-border" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48 bg-muted/50 border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="disbursed">Disbursed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="2024">
          <SelectTrigger className="w-32 bg-muted/50 border-border">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{allPayrollRuns.length}</span> payroll runs
        </p>
      </div>

      <PayrollRunTable payrollRuns={allPayrollRuns} />
    </div>
  )
}
