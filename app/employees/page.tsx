import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Upload } from "lucide-react"
import { EmployeeTable } from "@/components/employee-table"
import { mockEmployees } from "@/lib/mock-data"
import { InviteUserDialog } from "@/components/invite-user-dialog"

export default function EmployeesPage() {
  // Generate more mock employees for demonstration
  const allEmployees = [
    ...mockEmployees,
    {
      id: "3",
      companyId: "1",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael@acme.com",
      employeeId: "EMP-003",
      department: "Engineering",
      position: "Frontend Developer",
      employmentType: "FULL_TIME" as const,
      hireDate: new Date("2023-03-15"),
      baseSalary: 95000,
      currency: "USD",
      paymentFrequency: "MONTHLY" as const,
      bankAccountNumber: "****9012",
      bankName: "Wells Fargo",
      taxNumber: "456-78-9012",
      isActive: true,
      createdAt: new Date("2023-03-15"),
      updatedAt: new Date("2024-03-20"),
    },
    {
      id: "4",
      companyId: "1",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily@acme.com",
      employeeId: "EMP-004",
      department: "Marketing",
      position: "Marketing Manager",
      employmentType: "FULL_TIME" as const,
      hireDate: new Date("2023-04-01"),
      baseSalary: 88000,
      currency: "USD",
      paymentFrequency: "MONTHLY" as const,
      bankAccountNumber: "****3456",
      bankName: "Chase Bank",
      taxNumber: "789-01-2345",
      isActive: true,
      createdAt: new Date("2023-04-01"),
      updatedAt: new Date("2024-03-18"),
    },
    {
      id: "5",
      companyId: "1",
      firstName: "David",
      lastName: "Wilson",
      email: "david@acme.com",
      employeeId: "EMP-005",
      department: "Finance",
      position: "Financial Analyst",
      employmentType: "CONTRACT" as const,
      hireDate: new Date("2023-05-10"),
      baseSalary: 75000,
      currency: "USD",
      paymentFrequency: "MONTHLY" as const,
      bankAccountNumber: "****7890",
      bankName: "Bank of America",
      taxNumber: "234-56-7890",
      isActive: true,
      createdAt: new Date("2023-05-10"),
      updatedAt: new Date("2024-03-15"),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your workforce and employee information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <InviteUserDialog />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or employee ID..."
            className="pl-9 bg-muted/50 border-border"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-48 bg-muted/50 border-border">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-48 bg-muted/50 border-border">
            <SelectValue placeholder="Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full_time">Full Time</SelectItem>
            <SelectItem value="part_time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="intern">Intern</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{allEmployees.length}</span> employees
        </p>
      </div>

      <EmployeeTable employees={allEmployees} />
    </div>
  )
}
