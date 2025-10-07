import { z } from "zod"
import { EmploymentType, PaymentFrequency } from "../types/database"

export const employeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  employeeId: z.string().min(3, "Employee ID is required"),
  department: z.string().min(2, "Department is required"),
  position: z.string().min(2, "Position is required"),
  employmentType: z.nativeEnum(EmploymentType),
  hireDate: z.date(),
  baseSalary: z.number().positive("Salary must be positive"),
  paymentFrequency: z.nativeEnum(PaymentFrequency),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  taxNumber: z.string().optional(),
})

export type EmployeeInput = z.infer<typeof employeeSchema>
