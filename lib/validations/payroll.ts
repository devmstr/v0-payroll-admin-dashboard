import { z } from "zod"

export const payrollRunSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  periodStart: z.date(),
  periodEnd: z.date(),
  paymentDate: z.date(),
  isDryRun: z.boolean().default(false),
})

export const approvalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  comments: z.string().optional(),
})

export type PayrollRunInput = z.infer<typeof payrollRunSchema>
export type ApprovalInput = z.infer<typeof approvalSchema>
