import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Heart, Shield, Umbrella, Plane } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function BenefitsPage() {
  const benefits = [
    {
      id: "1",
      name: "Health Insurance",
      type: "health",
      provider: "Blue Cross Blue Shield",
      enrolledEmployees: 1142,
      totalEmployees: 1284,
      monthlyCost: "$145,680",
      employerContribution: "80%",
      status: "active",
    },
    {
      id: "2",
      name: "Dental Insurance",
      type: "dental",
      provider: "Delta Dental",
      enrolledEmployees: 987,
      totalEmployees: 1284,
      monthlyCost: "$23,450",
      employerContribution: "75%",
      status: "active",
    },
    {
      id: "3",
      name: "Vision Insurance",
      type: "vision",
      provider: "VSP Vision Care",
      enrolledEmployees: 856,
      totalEmployees: 1284,
      monthlyCost: "$8,920",
      employerContribution: "100%",
      status: "active",
    },
    {
      id: "4",
      name: "401(k) Retirement Plan",
      type: "retirement",
      provider: "Fidelity Investments",
      enrolledEmployees: 1098,
      totalEmployees: 1284,
      monthlyCost: "$89,340",
      employerContribution: "50% match",
      status: "active",
    },
    {
      id: "5",
      name: "Life Insurance",
      type: "life",
      provider: "MetLife",
      enrolledEmployees: 1284,
      totalEmployees: 1284,
      monthlyCost: "$12,840",
      employerContribution: "100%",
      status: "active",
    },
  ]

  const getBenefitIcon = (type: string) => {
    switch (type) {
      case "health":
      case "dental":
      case "vision":
        return <Heart className="w-5 h-5 text-primary" />
      case "life":
        return <Shield className="w-5 h-5 text-primary" />
      case "retirement":
        return <Umbrella className="w-5 h-5 text-primary" />
      default:
        return <Plane className="w-5 h-5 text-primary" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Benefits</h1>
          <p className="text-muted-foreground mt-1">Manage employee benefits and enrollment</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Benefit
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">5</div>
            <p className="text-xs text-muted-foreground mt-1">Active plans</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enrollment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">89%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all benefits</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground font-mono">$280K</div>
            <p className="text-xs text-muted-foreground mt-1">Total employer cost</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">Nov 1</div>
            <p className="text-xs text-muted-foreground mt-1">Next period</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">All Benefits</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search benefits..." className="pl-9 w-[300px] bg-background border-border" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Benefit</TableHead>
                <TableHead className="text-muted-foreground">Provider</TableHead>
                <TableHead className="text-muted-foreground">Enrollment</TableHead>
                <TableHead className="text-muted-foreground">Monthly Cost</TableHead>
                <TableHead className="text-muted-foreground">Employer Share</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benefits.map((benefit) => (
                <TableRow key={benefit.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {getBenefitIcon(benefit.type)}
                      </div>
                      <span className="font-medium text-foreground">{benefit.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{benefit.provider}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm text-foreground font-mono">
                        {benefit.enrolledEmployees} / {benefit.totalEmployees}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((benefit.enrolledEmployees / benefit.totalEmployees) * 100)}% enrolled
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground font-mono">{benefit.monthlyCost}</TableCell>
                  <TableCell className="text-sm text-foreground">{benefit.employerContribution}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {benefit.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Manage
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
