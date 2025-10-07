"use client"

import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Play, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { PayrollRun } from "@/lib/types/database"
import { PayrollStatus } from "@/lib/types/database"

interface PayrollRunTableProps {
  payrollRuns: PayrollRun[]
}

export function PayrollRunTable({ payrollRuns }: PayrollRunTableProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  return (
    <div className="border border-border rounded-lg bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground">Payroll Run</TableHead>
            <TableHead className="text-muted-foreground">Period</TableHead>
            <TableHead className="text-muted-foreground">Payment Date</TableHead>
            <TableHead className="text-muted-foreground">Gross Pay</TableHead>
            <TableHead className="text-muted-foreground">Net Pay</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollRuns.map((run) => (
            <TableRow key={run.id} className="border-border hover:bg-muted/50">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{run.name}</span>
                  {run.isDryRun && <span className="text-xs text-muted-foreground">Dry Run</span>}
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                {formatDate(run.periodStart)} - {formatDate(run.periodEnd)}
              </TableCell>
              <TableCell className="text-foreground">{formatDate(run.paymentDate)}</TableCell>
              <TableCell className="font-mono text-sm text-foreground">
                {formatCurrency(run.totalGross, run.currency)}
              </TableCell>
              <TableCell className="font-mono text-sm text-foreground">
                {formatCurrency(run.totalNet, run.currency)}
              </TableCell>
              <TableCell>{getStatusBadge(run.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/payroll/${run.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {run.status === PayrollStatus.DRAFT && (
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        Run Dry Run
                      </DropdownMenuItem>
                    )}
                    {run.status === PayrollStatus.PENDING_APPROVAL && (
                      <DropdownMenuItem>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
