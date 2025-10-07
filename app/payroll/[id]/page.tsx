import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, CheckCircle, XCircle, Download, Send } from "lucide-react"
import Link from "next/link"
import { mockPayrollRuns, mockEmployees } from "@/lib/mock-data"
import { PayrollStatus } from "@/lib/types/database"

export default function PayrollDetailPage({ params }: { params: { id: string } }) {
  const payrollRun = mockPayrollRuns[0]

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: PayrollStatus) => {
    const config: Record<
      PayrollStatus,
      { variant: "default" | "secondary" | "outline" | "destructive"; className: string }
    > = {
      [PayrollStatus.DRAFT]: { variant: "secondary", className: "bg-muted text-muted-foreground" },
      [PayrollStatus.DRY_RUN]: { variant: "outline", className: "bg-info/10 text-info border-info/20" },
      [PayrollStatus.PENDING_APPROVAL]: {
        variant: "outline",
        className: "bg-warning/10 text-warning border-warning/20",
      },
      [PayrollStatus.APPROVED]: { variant: "outline", className: "bg-success/10 text-success border-success/20" },
      [PayrollStatus.PROCESSING]: { variant: "outline", className: "bg-primary/10 text-primary border-primary/20" },
      [PayrollStatus.DISBURSED]: { variant: "default", className: "bg-success/10 text-success border-success/20" },
      [PayrollStatus.FAILED]: {
        variant: "destructive",
        className: "bg-destructive/10 text-destructive border-destructive/20",
      },
      [PayrollStatus.CANCELLED]: { variant: "secondary", className: "bg-muted text-muted-foreground" },
    }

    const { variant, className } = config[status]
    return (
      <Badge variant={variant} className={className}>
        {status.replace("_", " ")}
      </Badge>
    )
  }

  // Mock payroll items for each employee
  const payrollItems = mockEmployees.map((employee, index) => ({
    id: `item-${index}`,
    employee,
    grossPay: employee.baseSalary / 12,
    taxAmount: (employee.baseSalary / 12) * 0.2,
    deductions: (employee.baseSalary / 12) * 0.05,
    benefits: 500,
    netPay: (employee.baseSalary / 12) * 0.75 + 500,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/payroll">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{payrollRun.name}</h1>
            <p className="text-muted-foreground mt-1">
              {formatDate(payrollRun.periodStart)} - {formatDate(payrollRun.periodEnd)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {payrollRun.status === PayrollStatus.PENDING_APPROVAL && (
            <>
              <Button variant="outline">
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          )}
          {payrollRun.status === PayrollStatus.APPROVED && (
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Disburse Payments
            </Button>
          )}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Gross Pay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground font-mono">
              {formatCurrency(payrollRun.totalGross, payrollRun.currency)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground font-mono">
              {formatCurrency(payrollRun.totalTax, payrollRun.currency)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground font-mono">
              {formatCurrency(payrollRun.totalDeductions, payrollRun.currency)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Net Pay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground font-mono">
              {formatCurrency(payrollRun.totalNet, payrollRun.currency)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Payroll Details</CardTitle>
            {getStatusBadge(payrollRun.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment Date</p>
              <p className="text-foreground">{formatDate(payrollRun.paymentDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Currency</p>
              <p className="text-foreground">{payrollRun.currency}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Employees</p>
              <p className="text-foreground">{payrollItems.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Employee Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-muted-foreground">Employee</TableHead>
                  <TableHead className="text-muted-foreground">Gross Pay</TableHead>
                  <TableHead className="text-muted-foreground">Tax</TableHead>
                  <TableHead className="text-muted-foreground">Deductions</TableHead>
                  <TableHead className="text-muted-foreground">Benefits</TableHead>
                  <TableHead className="text-muted-foreground">Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollItems.map((item) => (
                  <TableRow key={item.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {item.employee.firstName} {item.employee.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.employee.employeeId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">
                      {formatCurrency(item.grossPay, payrollRun.currency)}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">
                      {formatCurrency(item.taxAmount, payrollRun.currency)}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">
                      {formatCurrency(item.deductions, payrollRun.currency)}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">
                      {formatCurrency(item.benefits, payrollRun.currency)}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-semibold text-foreground">
                      {formatCurrency(item.netPay, payrollRun.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
