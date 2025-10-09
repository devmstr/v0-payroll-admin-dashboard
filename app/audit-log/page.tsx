import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, FileText, User, DollarSign, Settings, Shield } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AuditLogPage() {
  const logs = [
    {
      id: "1",
      action: "Payroll Approved",
      entity: "Payroll Run",
      entityId: "PR-2024-04",
      user: "Sarah Johnson",
      userId: "USR-045",
      timestamp: "2024-04-15 14:32:18",
      ipAddress: "192.168.1.45",
      changes: { status: { from: "pending", to: "approved" } },
      category: "payroll",
    },
    {
      id: "2",
      action: "Employee Created",
      entity: "Employee",
      entityId: "EMP-1285",
      user: "Michael Chen",
      userId: "USR-089",
      timestamp: "2024-04-15 13:15:42",
      ipAddress: "192.168.1.89",
      changes: { name: "John Doe", salary: "$85,000" },
      category: "employee",
    },
    {
      id: "3",
      action: "Bank Transfer Initiated",
      entity: "Bank Transfer",
      entityId: "BT-2024-0456",
      user: "System",
      userId: "SYSTEM",
      timestamp: "2024-04-15 12:00:00",
      ipAddress: "10.0.0.1",
      changes: { amount: "$2,456,890", status: "processing" },
      category: "transfer",
    },
    {
      id: "4",
      action: "Settings Updated",
      entity: "Company Settings",
      entityId: "COMP-001",
      user: "Admin User",
      userId: "USR-001",
      timestamp: "2024-04-15 10:45:23",
      ipAddress: "192.168.1.1",
      changes: { payrollFrequency: { from: "monthly", to: "bi-weekly" } },
      category: "settings",
    },
    {
      id: "5",
      action: "User Role Changed",
      entity: "User",
      entityId: "USR-234",
      user: "Admin User",
      userId: "USR-001",
      timestamp: "2024-04-15 09:30:15",
      ipAddress: "192.168.1.1",
      changes: { role: { from: "viewer", to: "admin" } },
      category: "user",
    },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "payroll":
        return <DollarSign className="w-4 h-4" />
      case "employee":
        return <User className="w-4 h-4" />
      case "transfer":
        return <FileText className="w-4 h-4" />
      case "settings":
        return <Settings className="w-4 h-4" />
      case "user":
        return <Shield className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payroll":
        return "bg-primary/10 text-primary border-primary/20"
      case "employee":
        return "bg-success/10 text-success border-success/20"
      case "transfer":
        return "bg-warning/10 text-warning border-warning/20"
      case "settings":
        return "bg-info/10 text-info border-info/20"
      case "user":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Audit Log</h1>
        <p className="text-muted-foreground mt-1">Track all system activities and changes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">12,458</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">156</div>
            <p className="text-xs text-muted-foreground mt-1">Events logged</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">23</div>
            <p className="text-xs text-muted-foreground mt-1">In last 24 hours</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">3</div>
            <p className="text-xs text-muted-foreground mt-1">Requires review</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Activity Log</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] bg-background border-border">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-9 w-[250px] bg-background border-border" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Timestamp</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
                <TableHead className="text-muted-foreground">Entity</TableHead>
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-border">
                  <TableCell className="text-sm text-muted-foreground font-mono">{log.timestamp}</TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{log.action}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-foreground">{log.entity}</div>
                      <div className="text-xs text-muted-foreground font-mono">{log.entityId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-foreground">{log.user}</div>
                      <div className="text-xs text-muted-foreground font-mono">{log.userId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(log.category)}>
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(log.category)}
                        {log.category}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
