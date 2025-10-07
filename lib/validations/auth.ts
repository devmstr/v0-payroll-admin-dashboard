import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    companyTaxId: z.string().min(5, "Tax ID is required"),
    country: z.string().min(2, "Country is required"),
    currency: z.string().length(3, "Currency code must be 3 characters"),
    fullName: z.string().min(2, "Full name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["HR_MANAGER", "ACCOUNTANT", "EMPLOYEE"]),
  fullName: z.string().min(2, "Full name is required"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type InviteUserInput = z.infer<typeof inviteUserSchema>
