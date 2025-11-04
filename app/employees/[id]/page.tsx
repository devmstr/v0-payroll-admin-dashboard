import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Mail,
  Calendar,
  DollarSign,
  Building2,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EditEmployeeDialog } from './edit-employee-dialog'

type EmployeeDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function EmployeeDetailPage({
  params
}: EmployeeDetailPageProps) {
  const { id } = await params

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      company: true,
      contracts: {
        orderBy: { startDate: 'desc' },
        take: 1
      }
    }
  })

  if (!employee) {
    notFound()
  }

  const latestContract = employee.contracts[0]
  const baseSalary = latestContract?.baseSalary ?? employee.baseSalary ?? 0
  const department = employee.department ?? 'Unassigned'
  const position = employee.position ?? 'Pending Assignment'
  const employmentType = employee.employmentType ?? 'FULL_TIME'
  const currency = employee.currency || 'DZD'
  const employeeNumber = employee.employeeNumber ?? employee.id
  const paymentFrequency = employee.paymentFrequency ?? 'MONTHLY'
  const email =
    employee.email ??
    `${employee.firstName}.${employee.lastName}@${employee.companyId.slice(
      0,
      6
    )}.example`.toLowerCase()
  const editableEmployee = {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email,
    employeeNumber: employee.employeeNumber,
    department: employee.department,
    position: employee.position,
    employmentType: employee.employmentType,
    baseSalary,
    bankAccountNumber: employee.bankAccountNumber,
    bankName: employee.bankName,
    taxNumber: employee.taxNumber,
    isActive: employee.isActive
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (!Number.isFinite(amount)) {
      return '-'
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/employees">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">{position}</p>
          </div>
        </div>
        <EditEmployeeDialog employee={editableEmployee} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Employee Number</p>
                  <p className="font-mono text-foreground">{employeeNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Employment Type
                  </p>
                  <Badge variant="default" className="font-normal">
                    {employmentType.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground">{email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Hire Date</p>
                    <p className="text-foreground">
                      {formatDate(employee.hireDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="text-foreground">{department}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="text-foreground">{position}</p>
                  </div>
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Base Salary</p>
                    <p className="text-lg font-semibold text-foreground font-mono">
                      {formatCurrency(Number(baseSalary), currency)}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Payment Frequency
                  </p>
                  <p className="text-foreground">{paymentFrequency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Banking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="text-foreground">
                    {employee.bankName ?? 'Not provided'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Account Number
                  </p>
                  <p className="font-mono text-foreground">
                    {employee.bankAccountNumber ?? 'Not provided'}
                  </p>
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tax Number</p>
                <p className="font-mono text-foreground">
                  {employee.taxNumber ?? 'Not provided'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant="default"
                  className="bg-success/10 text-success border-success/20"
                >
                  Active
                </Badge>
              </div>
              <Separator className="bg-border" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Years of Service
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  1.2 years
                </p>
              </div>
              <Separator className="bg-border" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Total Paid (YTD)
                </p>
                <p className="text-2xl font-semibold text-foreground font-mono">
                  {formatCurrency(360000, employee.currency)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Payslips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['March 2024', 'February 2024', 'January 2024'].map((month) => (
                <div
                  key={month}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {month}
                    </p>
                    <p className="text-xs text-muted-foreground">Disbursed</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
