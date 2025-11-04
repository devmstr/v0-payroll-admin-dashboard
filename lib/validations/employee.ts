import { EmploymentType } from '@prisma/client'
import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .max(191)
  .optional()
  .or(z.literal(''))

const employeeDetailsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  employeeNumber: z
    .string()
    .trim()
    .min(2, 'Employee number must be at least 2 characters')
    .optional()
    .or(z.literal('')),
  department: z.string().trim().min(2, 'Department is required'),
  position: z.string().trim().min(2, 'Position is required'),
  employmentType: z.nativeEnum(EmploymentType),
  baseSalary: z.coerce
    .number({
      invalid_type_error: 'Base salary must be a valid number'
    })
    .nonnegative('Base salary must be positive'),
  bankAccountNumber: optionalString,
  bankName: optionalString,
  taxNumber: optionalString,
  isActive: z.boolean()
})

export const employeeUpdateSchema = employeeDetailsSchema.extend({
  id: z.string().min(1, 'Employee id is required')
})

export const employeeCreateSchema = employeeDetailsSchema.extend({
  companyId: z.string().min(1, 'Company is required'),
  hireDate: z
    .string()
    .trim()
    .min(1, 'Hire date is required')
    .transform((value) => new Date(value))
})

export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>
export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>
export type EmployeeUpdateFormValues = z.input<typeof employeeUpdateSchema>
export type EmployeeCreateFormValues = z.input<typeof employeeCreateSchema>
