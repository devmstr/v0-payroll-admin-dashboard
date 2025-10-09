import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function LoansPage() {
  const loans = [
    {
      id: "1",
      employeeName: "John Smith",
      employeeId: "EMP-001",
      loanAmount: "$10,000",
      disbursedAmount: "$10,000",
      remainingBalance: "$6,500",
      monthlyDeduction: "$500",
      startDate: "Jan 1, 2024",
      endDate: "Aug 1, 2024",
      status: "active",
      progress: 35,
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      employeeId: "EMP-045",
      loanAmount: "$5,000",
      disbursedAmount: "$5,000",
      remainingBalance: "$1,250",
      monthlyDeduction: "$250",
      startDate: "Nov 1, 2023",
      endDate: "Jun 1, 2024",
      status: "active",
      progress: 75,
    },
    {
      id: "3",
      employeeName: "Michael Chen",
      employeeId: "EMP-089",
      loanAmount: "$15,000",
      disbursedAmount: "$15,000",
      remainingBalance: "$0",
      monthlyDeduction: "$750",
      startDate: "Jan 1, 2023",
      endDate: "Dec 1, 2023",
      status: "completed",
      progress: 100,
    },
    {
      id: "4",
      employeeName: "Emily Davis",
      employeeId: "EMP-123",
      loanAmount: "$8,000",
      disbursedAmount: "$0",
      remainingBalance: "$8,000",
      monthlyDeduction: "$400",
      startDate: "May 1, 2024",
      endDate: "Apr 1, 2025",
      status: "pending",
      progress: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary border-primary/20"
      case "completed":
        return "bg-success/10 text-success border-success/20"
      case "pending":
        return "bg-warning/10 text-warning border-warning/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Loans</h1>
          <p className="text-muted-foreground mt-1">Manage employee loans and repayments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Loan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">24</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Disbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground font-mono">$245K</div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground font-mono">$156K</div>
            <p className="text-xs text-muted-foreground mt-1">To be recovered</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Recovery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground font-mono">$18K</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">All Loans</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search loans..." className="pl-9 w-[300px] bg-background border-border" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Employee</TableHead>
                <TableHead className="text-muted-foreground">Loan Amount</TableHead>
                <TableHead className="text-muted-foreground">Remaining</TableHead>
                <TableHead className="text-muted-foreground">Monthly Deduction</TableHead>
                <TableHead className="text-muted-foreground">Progress</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id} className="border-border">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{loan.employeeName}</div>
                      <div className="text-xs text-muted-foreground">{loan.employeeId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground font-mono">{loan.loanAmount}</TableCell>
                  <TableCell className="text-sm text-foreground font-mono">{loan.remainingBalance}</TableCell>
                  <TableCell className="text-sm text-foreground font-mono">{loan.monthlyDeduction}</TableCell>
                  <TableCell>
                    <div className="space-y-1 min-w-[120px]">
                      <Progress value={loan.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">{loan.progress}% repaid</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(loan.status)}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
