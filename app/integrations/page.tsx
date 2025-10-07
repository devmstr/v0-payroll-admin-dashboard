import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Building2, Database, FileText, DollarSign, Users, Calendar, CheckCircle, Settings } from "lucide-react"

export default function IntegrationsPage() {
  const integrations = [
    {
      id: "1",
      name: "Chase Bank API",
      provider: "Chase",
      type: "Banking",
      description: "Direct bank transfers and account verification",
      icon: Building2,
      isActive: true,
      isConnected: true,
      lastSync: "2 hours ago",
      features: ["Direct Deposits", "Account Verification", "Transaction History"],
    },
    {
      id: "2",
      name: "QuickBooks",
      provider: "Intuit",
      type: "Accounting",
      description: "Sync payroll data with accounting software",
      icon: FileText,
      isActive: true,
      isConnected: true,
      lastSync: "1 day ago",
      features: ["Expense Tracking", "Financial Reports", "Tax Calculations"],
    },
    {
      id: "3",
      name: "Stripe",
      provider: "Stripe",
      type: "Payments",
      description: "Process contractor payments and invoices",
      icon: DollarSign,
      isActive: false,
      isConnected: true,
      lastSync: "Never",
      features: ["International Payments", "Invoice Management", "Payment Links"],
    },
    {
      id: "4",
      name: "BambooHR",
      provider: "BambooHR",
      type: "HRIS",
      description: "Employee data synchronization",
      icon: Users,
      isActive: true,
      isConnected: true,
      lastSync: "5 hours ago",
      features: ["Employee Records", "Time Off Tracking", "Performance Reviews"],
    },
    {
      id: "5",
      name: "ADP Workforce",
      provider: "ADP",
      type: "Tax Filing",
      description: "Automated tax filing and compliance",
      icon: Database,
      isActive: true,
      isConnected: true,
      lastSync: "3 days ago",
      features: ["Tax Filing", "W-2 Generation", "Compliance Reports"],
    },
    {
      id: "6",
      name: "Google Calendar",
      provider: "Google",
      type: "Calendar",
      description: "Sync payroll dates and deadlines",
      icon: Calendar,
      isActive: false,
      isConnected: false,
      lastSync: "Never",
      features: ["Calendar Sync", "Reminders", "Team Scheduling"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Integrations</h1>
          <p className="text-muted-foreground mt-1">Connect your payroll system with external services</p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Manage API Keys
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <integration.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-foreground">{integration.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{integration.description}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {integration.type}
                      </Badge>
                      {integration.isConnected && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Switch checked={integration.isActive} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator className="bg-border" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Features</p>
                <ul className="space-y-1">
                  {integration.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Sync</p>
                  <p className="text-sm text-foreground">{integration.lastSync}</p>
                </div>
                <Button variant="outline" size="sm">
                  {integration.isConnected ? "Configure" : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Integration Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                integration: "Chase Bank API",
                action: "Processed 1,284 transfers",
                time: "2 hours ago",
                status: "success",
              },
              {
                integration: "QuickBooks",
                action: "Synced payroll data",
                time: "1 day ago",
                status: "success",
              },
              {
                integration: "BambooHR",
                action: "Updated 12 employee records",
                time: "5 hours ago",
                status: "success",
              },
              {
                integration: "ADP Workforce",
                action: "Generated tax reports",
                time: "3 days ago",
                status: "success",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.integration}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
