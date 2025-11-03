import { z } from 'zod'

export const CompanySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  nif: z
    .string()
    .trim()
    .min(5, 'NIF seems too short')
    .max(20)
    .optional()
    .or(z.literal('')),
  cnasNumber: z.string().trim().max(20).optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  address: z.string().trim().max(200).optional().or(z.literal(''))
})

export type CompanyInput = z.infer<typeof CompanySchema>
