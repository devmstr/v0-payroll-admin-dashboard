import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { DisbursementStatus } from "@/lib/types/database"

export default function BankTransfersPage() {
  const stats = [
    {
      title: "Total Transfers",
      value: "1,284",
      change: "+12 today",
      icon: TrendingUp,
    },
    {
      title: "Successful",
      value: "1,268",
      change: "98.8%",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Failed",
      value: "16",
      change: "1.2%",
      icon: XCircle,
      color: "text-destructive",
    },
    {
      title: "Total Amount",
      value: "$2.4M",
      change: "This month",
      icon: DollarSign,
    },
  ]

  const transactions = [
    {
      id: "TXN-001",
      employee: "John Doe",
      employeeId: "EMP-001",
      amount: 10000,
      currency: "USD",
      bankName: "Chase Bank",
      accountNumber: "****1234",
      status: DisbursementStatus.SUCCESS,
      transactionId: "CH-2024-04-001",
      processedAt: new Date("2024-04-01T10:30:00"),
    },
    {
      id: "TXN-002",
      employee: "Sarah Johnson",
      employeeId: "EMP-002",
      amount: 7916.67,
      currency: "USD",
      bankName: "Bank of America",
      accountNumber: "****5678",
      status: DisbursementStatus.SUCCESS,
      transactionId: "BOA-2024-04-002",
      processedAt: new Date("2024-04-01T10:31:00"),
    },
    {
      id: "TXN-003",
      employee: "Michael Chen",
      employeeId: "EMP-003",
      amount: 7916.67,
      currency: "USD",
      bankName: "Wells Fargo",
      accountNumber: "****9012",
      status: DisbursementStatus.FAILED,
      failureReason: "Invalid account number",
      processedAt: new Date("2024-04-01T10:32:00"),
    },
    {
      id: "TXN-004",
      employee: "Emily Davis",
      employeeId: "EMP-004",
      amount: 7333.33,
      currency: "USD",
      bankName: "Chase Bank",
      accountNumber: "****3456",
      status: DisbursementStatus.PROCESSING,
      processedAt: new Date("2024-04-01T10:33:00"),
    },
    {
      id: "TXN-005",
      employee: "David Wilson",
      employeeId: "EMP-005",
      amount: 6250,
      currency: "USD",
      bankName: "Bank of America",
      accountNumber: "****7890",
      status: DisbursementStatus.RETRY,
      failureReason: "Temporary network error",
      processedAt: new Date("2024-04-01T10:34:00"),
    },
  ]

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount)
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: DisbursementStatus) => {
    const config: Record<
      DisbursementStatus,
      { icon: React.ComponentType<{ className?: string }>; className: string; label: string }
    > = {
      [DisbursementStatus.PENDING]: {
        icon: Clock,
        className: "bg-muted text-muted-foreground",
        label: "Pending",
      },
      [DisbursementStatus.PROCESSING]: {
        icon: RefreshCw,
        className: "bg-primary/10 text-primary border-primary/20",
        label: "Processing",
      },
      [DisbursementStatus.SUCCESS]: {
        icon: CheckCircle,
        className: "bg-success/10 text-success border-success/20",
        label: "Success",
      },
      [DisbursementStatus.FAILED]: {
        icon: XCircle,
        className: "bg-destructive/10 text-destructive border-destructive/20",
        label: "Failed",
      },
      [DisbursementStatus.RETRY]: {
        icon: AlertCircle,
        className: "bg-warning/10 text-warning border-warning/20",
        label: "Retry",
      },
    }

    const { icon: Icon, className, label } = config[status]
    return (
      <Badge variant="outline" className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Bank Transfers</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage payroll disbursements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Status
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by employee, transaction ID..."
            className="pl-9 bg-muted/50 border-border"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48 bg-muted/50 border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="retry">Retry</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="today">
          <SelectTrigger className="w-48 bg-muted/50 border-border">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                  <TableHead className="text-muted-foreground">Employee</TableHead>
                  <TableHead className="text-muted-foreground">Bank Details</TableHead>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Processed At</TableHead>
                  <TableHead className="text-muted-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-mono text-sm text-foreground">{txn.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{txn.employee}</span>
                        <span className="text-xs text-muted-foreground">{txn.employeeId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">{txn.bankName}</span>
                        <span className="text-xs text-muted-foreground font-mono">{txn.accountNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">
                      {formatCurrency(txn.amount, txn.currency)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(txn.status)}
                        {txn.failureReason && <span className="text-xs text-destructive">{txn.failureReason}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{formatDateTime(txn.processedAt)}</TableCell>
                    <TableCell>
                      {txn.status === DisbursementStatus.FAILED && (
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
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
