import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Employees",
      value: "1,284",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Monthly Payroll",
      value: "$2.4M",
      change: "+4.2%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Avg. Salary",
      value: "$85,420",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Pending Approvals",
      value: "3",
      change: "Requires action",
      trend: "alert",
      icon: AlertCircle,
    },
  ]

  const recentPayrolls = [
    {
      id: "PR-2024-03",
      period: "March 2024",
      status: "Disbursed",
      amount: "$2,456,890",
      date: "Mar 31, 2024",
    },
    {
      id: "PR-2024-02",
      period: "February 2024",
      status: "Disbursed",
      amount: "$2,398,450",
      date: "Feb 29, 2024",
    },
    {
      id: "PR-2024-01",
      period: "January 2024",
      status: "Disbursed",
      amount: "$2,412,330",
      date: "Jan 31, 2024",
    },
  ]

  const pendingApprovals = [
    {
      id: "1",
      title: "April 2024 Payroll Run",
      requester: "Sarah Johnson",
      amount: "$2,487,920",
      date: "2 hours ago",
    },
    {
      id: "2",
      title: "Bonus Distribution Q1",
      requester: "Michael Chen",
      amount: "$145,000",
      date: "5 hours ago",
    },
    {
      id: "3",
      title: "New Employee Onboarding",
      requester: "Emily Davis",
      amount: "$12,500",
      date: "1 day ago",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your payroll operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" && <ArrowUpRight className="w-3 h-3 text-success" />}
                {stat.trend === "down" && <ArrowDownRight className="w-3 h-3 text-destructive" />}
                {stat.trend === "alert" && <AlertCircle className="w-3 h-3 text-warning" />}
                <span
                  className={`text-xs ${
                    stat.trend === "up" ? "text-success" : stat.trend === "down" ? "text-destructive" : "text-warning"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Recent Payroll Runs</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/payroll">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayrolls.map((payroll) => (
                <div
                  key={payroll.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{payroll.period}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">
                        {payroll.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {payroll.id} • {payroll.date}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-foreground font-mono">{payroll.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Pending Approvals</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/approvals">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{approval.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {approval.requester} • {approval.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm font-semibold text-foreground font-mono whitespace-nowrap">
                      {approval.amount}
                    </span>
                    <Button size="sm" className="h-7">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
