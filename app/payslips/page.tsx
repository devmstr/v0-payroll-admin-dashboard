import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye } from "lucide-react"

export default function PayslipsPage() {
  const payslips = [
    {
      id: "1",
      employee: "John Doe",
      employeeId: "EMP-001",
      period: "March 2024",
      grossPay: 10000,
      netPay: 7500,
      date: "Mar 31, 2024",
    },
    {
      id: "2",
      employee: "Sarah Johnson",
      employeeId: "EMP-002",
      period: "March 2024",
      grossPay: 7916.67,
      netPay: 5937.5,
      date: "Mar 31, 2024",
    },
    {
      id: "3",
      employee: "Michael Chen",
      employeeId: "EMP-003",
      period: "March 2024",
      grossPay: 7916.67,
      netPay: 5937.5,
      date: "Mar 31, 2024",
    },
    {
      id: "4",
      employee: "Emily Davis",
      employeeId: "EMP-004",
      period: "March 2024",
      grossPay: 7333.33,
      netPay: 5500,
      date: "Mar 31, 2024",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Payslips</h1>
          <p className="text-muted-foreground mt-1">View and download employee payslips</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Bulk Download
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by employee name or ID..."
            className="pl-9 bg-muted/50 border-border"
          />
        </div>
        <Select defaultValue="march">
          <SelectTrigger className="w-48 bg-muted/50 border-border">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="march">March 2024</SelectItem>
            <SelectItem value="february">February 2024</SelectItem>
            <SelectItem value="january">January 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Payslips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-muted-foreground">Employee</TableHead>
                  <TableHead className="text-muted-foreground">Period</TableHead>
                  <TableHead className="text-muted-foreground">Gross Pay</TableHead>
                  <TableHead className="text-muted-foreground">Net Pay</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((payslip) => (
                  <TableRow key={payslip.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{payslip.employee}</span>
                        <span className="text-xs text-muted-foreground">{payslip.employeeId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{payslip.period}</TableCell>
                    <TableCell className="font-mono text-sm text-foreground">
                      {formatCurrency(payslip.grossPay)}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-semibold text-foreground">
                      {formatCurrency(payslip.netPay)}
                    </TableCell>
                    <TableCell className="text-foreground">{payslip.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
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
