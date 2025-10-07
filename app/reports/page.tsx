"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, TrendingUp, Users, DollarSign, PieChart } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ReportsPage() {
  const payrollTrendData = [
    { month: "Jan", amount: 2412330 },
    { month: "Feb", amount: 2398450 },
    { month: "Mar", amount: 2456890 },
    { month: "Apr", amount: 2487920 },
    { month: "May", amount: 2501200 },
    { month: "Jun", amount: 2534500 },
  ]

  const departmentData = [
    { department: "Engineering", employees: 450, cost: 1200000 },
    { department: "Sales", employees: 280, cost: 680000 },
    { department: "Marketing", employees: 180, cost: 420000 },
    { department: "Operations", employees: 220, cost: 380000 },
    { department: "HR", employees: 154, cost: 287920 },
  ]

  const reportTemplates = [
    {
      id: "1",
      name: "Monthly Payroll Summary",
      description: "Comprehensive overview of monthly payroll expenses",
      icon: FileText,
      lastGenerated: "2 days ago",
    },
    {
      id: "2",
      name: "Tax Withholding Report",
      description: "Federal and state tax withholdings breakdown",
      icon: DollarSign,
      lastGenerated: "1 week ago",
    },
    {
      id: "3",
      name: "Department Cost Analysis",
      description: "Payroll costs by department and team",
      icon: PieChart,
      lastGenerated: "3 days ago",
    },
    {
      id: "4",
      name: "Employee Compensation Report",
      description: "Individual employee salary and benefits breakdown",
      icon: Users,
      lastGenerated: "5 days ago",
    },
    {
      id: "5",
      name: "Year-to-Date Summary",
      description: "Annual payroll expenses and trends",
      icon: TrendingUp,
      lastGenerated: "1 day ago",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and analyze payroll reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="w-32 bg-muted/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Payroll Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Monthly payroll expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: "Amount",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={payrollTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Department Costs</CardTitle>
            <CardDescription className="text-muted-foreground">Payroll expenses by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cost: {
                  label: "Cost",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cost" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Report Templates</CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate standard payroll reports with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((template) => (
              <div key={template.id} className="p-4 rounded-lg border border-border bg-muted/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <template.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">Last: {template.lastGenerated}</span>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1.5" />
                    Generate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Department Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentData.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{dept.department}</p>
                  <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground font-mono">{formatCurrency(dept.cost)}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(dept.cost / dept.employees)}/employee</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
