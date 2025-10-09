import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Shield, Eye, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function UsersPage() {
  const users = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@company.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-04-15 14:32",
      companies: ["Acme Corporation", "TechStart Inc"],
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "manager",
      status: "active",
      lastLogin: "2024-04-15 13:15",
      companies: ["Acme Corporation"],
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael.c@company.com",
      role: "manager",
      status: "active",
      lastLogin: "2024-04-15 10:45",
      companies: ["TechStart Inc"],
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.d@company.com",
      role: "viewer",
      status: "active",
      lastLogin: "2024-04-14 16:20",
      companies: ["Acme Corporation"],
    },
    {
      id: "5",
      name: "John Smith",
      email: "john.s@company.com",
      role: "viewer",
      status: "inactive",
      lastLogin: "2024-03-28 09:15",
      companies: ["Global Solutions"],
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "manager":
        return "bg-primary/10 text-primary border-primary/20"
      case "viewer":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-success/10 text-success border-success/20"
      : "bg-muted text-muted-foreground border-border"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">45</div>
            <p className="text-xs text-muted-foreground mt-1">Across all companies</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">42</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">3</div>
            <p className="text-xs text-muted-foreground mt-1">System administrators</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">2</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting acceptance</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">All Users</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9 w-[300px] bg-background border-border" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Companies</TableHead>
                <TableHead className="text-muted-foreground">Last Login</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleColor(user.role)}>
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground">{user.companies.length} companies</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {user.companies.join(", ")}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
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
