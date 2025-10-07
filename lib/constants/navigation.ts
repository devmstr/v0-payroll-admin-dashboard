import type React from "react"
import {
  LayoutDashboard,
  Building2,
  Users,
  Calculator,
  FileText,
  CheckSquare,
  CreditCard,
  FileBarChart,
  Gift,
  Wallet,
  Plug,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Companies",
        href: "/companies",
        icon: Building2,
      },
      {
        title: "Employees",
        href: "/employees",
        icon: Users,
      },
    ],
  },
  {
    title: "Payroll",
    items: [
      {
        title: "Payroll Runs",
        href: "/payroll",
        icon: Calculator,
      },
      {
        title: "Payslips",
        href: "/payslips",
        icon: FileText,
      },
      {
        title: "Approvals",
        href: "/approvals",
        icon: CheckSquare,
        badge: "3",
      },
      {
        title: "Bank Transfers",
        href: "/bank-transfers",
        icon: CreditCard,
      },
      {
        title: "Tax & Compliance",
        href: "/tax-compliance",
        icon: FileBarChart,
      },
    ],
  },
  {
    title: "Benefits & Loans",
    items: [
      {
        title: "Benefits",
        href: "/benefits",
        icon: Gift,
      },
      {
        title: "Loans",
        href: "/loans",
        icon: Wallet,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Integrations",
        href: "/integrations",
        icon: Plug,
      },
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
      {
        title: "Admin Console",
        href: "/admin",
        icon: Shield,
      },
    ],
  },
]
