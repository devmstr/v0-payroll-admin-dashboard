// Core database types for the payroll system
// These represent the Prisma schema structure

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  COMPANY_ADMIN = "COMPANY_ADMIN",
  HR_MANAGER = "HR_MANAGER",
  ACCOUNTANT = "ACCOUNTANT",
  EMPLOYEE = "EMPLOYEE",
}

export enum PayrollStatus {
  DRAFT = "DRAFT",
  DRY_RUN = "DRY_RUN",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  PROCESSING = "PROCESSING",
  DISBURSED = "DISBURSED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum DisbursementStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  RETRY = "RETRY",
}

export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERN = "INTERN",
}

export enum PaymentFrequency {
  MONTHLY = "MONTHLY",
  BI_WEEKLY = "BI_WEEKLY",
  WEEKLY = "WEEKLY",
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  taxId: string
  currency: string
  country: string
  address: string
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  id: string
  companyId: string
  userId?: string
  firstName: string
  lastName: string
  email: string
  employeeId: string
  department: string
  position: string
  employmentType: EmploymentType
  hireDate: Date
  terminationDate?: Date
  baseSalary: number
  currency: string
  paymentFrequency: PaymentFrequency
  bankAccountNumber?: string
  bankName?: string
  taxNumber?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PayrollRun {
  id: string
  companyId: string
  name: string
  periodStart: Date
  periodEnd: Date
  paymentDate: Date
  status: PayrollStatus
  totalGross: number
  totalNet: number
  totalTax: number
  totalDeductions: number
  currency: string
  isDryRun: boolean
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export interface PayrollItem {
  id: string
  payrollRunId: string
  employeeId: string
  grossPay: number
  netPay: number
  taxAmount: number
  deductions: number
  benefits: number
  currency: string
  status: DisbursementStatus
  createdAt: Date
  updatedAt: Date
}

export interface Benefit {
  id: string
  companyId: string
  name: string
  type: string
  amount: number
  isPercentage: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Loan {
  id: string
  employeeId: string
  companyId: string
  amount: number
  remainingAmount: number
  monthlyDeduction: number
  startDate: Date
  endDate?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Approval {
  id: string
  payrollRunId: string
  approverId: string
  status: ApprovalStatus
  comments?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  id: string
  companyId: string
  userId: string
  action: string
  entityType: string
  entityId: string
  changes: Record<string, unknown>
  ipAddress?: string
  createdAt: Date
}

export interface TaxConfig {
  id: string
  companyId: string
  country: string
  taxYear: number
  brackets: Record<string, unknown>
  version: number
  effectiveFrom: Date
  effectiveTo?: Date
  createdAt: Date
  updatedAt: Date
}

export interface BankTransaction {
  id: string
  payrollItemId: string
  employeeId: string
  amount: number
  currency: string
  status: DisbursementStatus
  bankName: string
  accountNumber: string
  transactionId?: string
  failureReason?: string
  retryCount: number
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Integration {
  id: string
  companyId: string
  name: string
  type: string
  provider: string
  isActive: boolean
  config: Record<string, unknown>
  lastSyncAt?: Date
  createdAt: Date
  updatedAt: Date
}
