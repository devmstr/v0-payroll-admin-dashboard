import { z } from "zod"

export const payrollRunSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  periodStart: z.date(),
  periodEnd: z.date(),
  paymentDate: z.date(),
  isDryRun: z.boolean().default(false),
  companyId: z.string().cuid(),
})

export const approvalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  comments: z.string().optional(),
  payrollRunId: z.string().cuid(),
})

export const employeePayrollInputSchema = z.object({
  employeeId: z.string().cuid(),
  baseSalary: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid decimal format"),
  overtimeHours: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  overtimeRate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  bonus: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  commission: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  allowances: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  taxFilingStatus: z.enum(["single", "married", "head_of_household"]),
  taxAllowances: z.number().int().min(0).max(20),
  stateCode: z.string().length(2),
  healthInsurancePremium: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  retirement401kPercent: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  otherDeductions: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
})

export const bankTransferSchema = z.object({
  payrollRunId: z.string().cuid(),
  employeeId: z.string().cuid(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid decimal format"),
  currency: z.string().length(3).default("USD"),
  bankName: z.string().min(1),
  accountNumber: z.string().min(4),
  routingNumber: z.string().length(9),
  scheduledAt: z.date(),
})

export type PayrollRunInput = z.infer<typeof payrollRunSchema>
export type ApprovalInput = z.infer<typeof approvalSchema>
export type EmployeePayrollInput = z.infer<typeof employeePayrollInputSchema>
export type BankTransferInput = z.infer<typeof bankTransferSchema>
