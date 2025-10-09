import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, FileText, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TaxCompliancePage() {
  const filings = [
    {
      id: "1",
      type: "Federal Income Tax",
      period: "Q1 2024",
      dueDate: "Apr 15, 2024",
      status: "filed",
      amount: "$145,890",
      filedDate: "Apr 10, 2024",
    },
    {
      id: "2",
      type: "State Tax - CA",
      period: "Q1 2024",
      dueDate: "Apr 30, 2024",
      status: "pending",
      amount: "$32,450",
      filedDate: null,
    },
    {
      id: "3",
      type: "Social Security",
      period: "March 2024",
      dueDate: "Apr 15, 2024",
      status: "filed",
      amount: "$89,234",
      filedDate: "Apr 12, 2024",
    },
    {
      id: "4",
      type: "Medicare",
      period: "March 2024",
      dueDate: "Apr 15, 2024",
      status: "filed",
      amount: "$20,876",
      filedDate: "Apr 12, 2024",
    },
    {
      id: "5",
      type: "Unemployment Tax",
      period: "Q1 2024",
      dueDate: "May 1, 2024",
      status: "draft",
      amount: "$12,340",
      filedDate: null,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "filed":
        return <CheckCircle2 className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "draft":
        return <FileText className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filed":
        return "bg-success/10 text-success border-success/20"
      case "pending":
        return "bg-warning/10 text-warning border-warning/20"
      case "draft":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-destructive/10 text-destructive border-destructive/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Tax & Compliance</h1>
          <p className="text-muted-foreground mt-1">Manage tax filings and compliance requirements</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Filed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">12</div>
            <p className="text-xs text-muted-foreground mt-1">This quarter</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-warning">3</div>
            <p className="text-xs text-muted-foreground mt-1">Requires action</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tax Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground font-mono">$458K</div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">Apr 30</div>
            <p className="text-xs text-muted-foreground mt-1">State Tax - CA</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Tax Filings</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-background border-border">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Filings</SelectItem>
                  <SelectItem value="filed">Filed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search filings..." className="pl-9 w-[250px] bg-background border-border" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Period</TableHead>
                <TableHead className="text-muted-foreground">Due Date</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filings.map((filing) => (
                <TableRow key={filing.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{filing.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{filing.period}</TableCell>
                  <TableCell className="text-sm text-foreground">{filing.dueDate}</TableCell>
                  <TableCell className="text-sm text-foreground font-mono">{filing.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(filing.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(filing.status)}
                        {filing.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {filing.status === "filed" && (
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
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
