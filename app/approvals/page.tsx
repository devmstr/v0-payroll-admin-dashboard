import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, User } from "lucide-react"
import Link from "next/link"

export default function ApprovalsPage() {
  const pendingApprovals = [
    {
      id: "1",
      type: "Payroll Run",
      title: "April 2024 Payroll Run",
      requester: "Sarah Johnson",
      requesterRole: "HR Manager",
      amount: "$2,487,920",
      date: "2 hours ago",
      description: "Monthly payroll for 1,284 employees",
      priority: "high",
    },
    {
      id: "2",
      type: "Bonus",
      title: "Bonus Distribution Q1",
      requester: "Michael Chen",
      requesterRole: "Finance Manager",
      amount: "$145,000",
      date: "5 hours ago",
      description: "Performance bonuses for engineering team",
      priority: "medium",
    },
    {
      id: "3",
      type: "Onboarding",
      title: "New Employee Onboarding",
      requester: "Emily Davis",
      requesterRole: "HR Coordinator",
      amount: "$12,500",
      date: "1 day ago",
      description: "Salary setup for 3 new hires",
      priority: "low",
    },
  ]

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { className: string; label: string }> = {
      high: { className: "bg-destructive/10 text-destructive border-destructive/20", label: "High Priority" },
      medium: { className: "bg-warning/10 text-warning border-warning/20", label: "Medium Priority" },
      low: { className: "bg-muted text-muted-foreground", label: "Low Priority" },
    }
    const { className, label } = config[priority]
    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and approve pending payroll requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 h-8 px-3">
            <Clock className="w-3 h-3 mr-1.5" />
            {pendingApprovals.length} Pending
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {pendingApprovals.map((approval) => (
          <Card key={approval.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-foreground">{approval.title}</CardTitle>
                    {getPriorityBadge(approval.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground">{approval.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-foreground font-mono">{approval.amount}</p>
                  <p className="text-xs text-muted-foreground mt-1">{approval.date}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{approval.requester}</p>
                    <p className="text-xs text-muted-foreground">{approval.requesterRole}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {approval.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/payroll/${approval.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Approved",
                title: "March 2024 Payroll",
                approver: "You",
                date: "2 days ago",
                status: "approved",
              },
              {
                action: "Approved",
                title: "February 2024 Payroll",
                approver: "You",
                date: "1 month ago",
                status: "approved",
              },
              {
                action: "Rejected",
                title: "Bonus Adjustment Request",
                approver: "You",
                date: "1 month ago",
                status: "rejected",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      activity.status === "approved" ? "bg-success/10" : "bg-destructive/10"
                    }`}
                  >
                    {activity.status === "approved" ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.action} {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.approver} • {activity.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
