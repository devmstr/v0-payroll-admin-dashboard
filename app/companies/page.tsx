import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Building2, Users, DollarSign, MapPin } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function CompaniesPage() {
  const companies = [
    {
      id: "1",
      name: "Acme Corporation",
      legalName: "Acme Corp Ltd.",
      country: "United States",
      currency: "USD",
      employees: 1284,
      monthlyPayroll: "$2,456,890",
      status: "active",
      taxId: "12-3456789",
    },
    {
      id: "2",
      name: "TechStart Inc",
      legalName: "TechStart Incorporated",
      country: "Canada",
      currency: "CAD",
      employees: 342,
      monthlyPayroll: "$892,450",
      status: "active",
      taxId: "987654321RC0001",
    },
    {
      id: "3",
      name: "Global Solutions",
      legalName: "Global Solutions GmbH",
      country: "Germany",
      currency: "EUR",
      employees: 567,
      monthlyPayroll: "€1,234,560",
      status: "active",
      taxId: "DE123456789",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Companies</h1>
          <p className="text-muted-foreground mt-1">Manage your multi-company payroll operations</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">All Companies</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search companies..." className="pl-9 w-[300px] bg-background border-border" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Company</TableHead>
                <TableHead className="text-muted-foreground">Location</TableHead>
                <TableHead className="text-muted-foreground">Employees</TableHead>
                <TableHead className="text-muted-foreground">Monthly Payroll</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{company.name}</div>
                        <div className="text-xs text-muted-foreground">{company.legalName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{company.country}</span>
                      <Badge variant="outline" className="text-xs">
                        {company.currency}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground font-mono">{company.employees}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground font-mono">{company.monthlyPayroll}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
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
