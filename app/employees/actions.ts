'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import {
  employeeCreateSchema,
  employeeUpdateSchema,
  type EmployeeCreateFormValues,
  type EmployeeCreateInput,
  type EmployeeUpdateFormValues,
  type EmployeeUpdateInput
} from '@/lib/validations/employee'
import { EmployeeStatus, Prisma } from '@prisma/client'

type UpdateEmployeeResult =
  | { success: true }
  | {
      success: false
      error?: string
      fieldErrors?: Record<string, string[]>
    }

export async function updateEmployeeAction(
  input: EmployeeUpdateFormValues
): Promise<UpdateEmployeeResult> {
  const parsed = employeeUpdateSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors
    }
  }

  const {
    id,
    employeeNumber,
    bankAccountNumber,
    bankName,
    taxNumber,
    ...rest
  } = parsed.data

  const normalizedEmployeeNumber =
    employeeNumber && employeeNumber.trim().length > 0
      ? employeeNumber.trim()
      : null
  const normalizedBankAccount =
    bankAccountNumber && bankAccountNumber.trim().length > 0
      ? bankAccountNumber.trim()
      : null
  const normalizedBankName =
    bankName && bankName.trim().length > 0 ? bankName.trim() : null
  const normalizedTaxNumber =
    taxNumber && taxNumber.trim().length > 0 ? taxNumber.trim() : null

  try {
    await prisma.$transaction(async (tx) => {
      const updatedEmployee = await tx.employee.update({
        where: { id },
        data: {
          ...rest,
          employeeNumber: normalizedEmployeeNumber,
          bankAccountNumber: normalizedBankAccount,
          bankName: normalizedBankName,
          taxNumber: normalizedTaxNumber,
          status: rest.isActive ? EmployeeStatus.ACTIVE : EmployeeStatus.INACTIVE
        }
      })

      const latestContract = await tx.contract.findFirst({
        where: { employeeId: id },
        orderBy: { startDate: 'desc' }
      })

      if (latestContract) {
        await tx.contract.update({
          where: { id: latestContract.id },
          data: {
            baseSalary: rest.baseSalary
          }
        })
      }

    })

    revalidatePath('/employees')
    revalidatePath(`/employees/${id}`)

    return { success: true }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        fieldErrors: {
          employeeNumber: ['Employee number must be unique']
        }
      }
    }

    console.error('Failed to update employee', error)
    return {
      success: false,
      error: 'Failed to update employee. Please try again.'
    }
  }
}

type CreateEmployeeResult =
  | { success: true; employeeId: string }
  | {
      success: false
      error?: string
      fieldErrors?: Record<string, string[]>
    }

export async function createEmployeeAction(
  input: EmployeeCreateFormValues
): Promise<CreateEmployeeResult> {
  const parsed = employeeCreateSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors
    }
  }

  const {
    companyId,
    hireDate,
    employeeNumber,
    bankAccountNumber,
    bankName,
    taxNumber,
    ...rest
  } = parsed.data

  const normalizedEmployeeNumber =
    employeeNumber && employeeNumber.trim().length > 0
      ? employeeNumber.trim()
      : null
  const normalizedBankAccount =
    bankAccountNumber && bankAccountNumber.trim().length > 0
      ? bankAccountNumber.trim()
      : null
  const normalizedBankName =
    bankName && bankName.trim().length > 0 ? bankName.trim() : null
  const normalizedTaxNumber =
    taxNumber && taxNumber.trim().length > 0 ? taxNumber.trim() : null

  try {
    const employee = await prisma.$transaction(async (tx) => {
      const createdEmployee = await tx.employee.create({
        data: {
          companyId,
          ...rest,
          employeeNumber: normalizedEmployeeNumber,
          bankAccountNumber: normalizedBankAccount,
          bankName: normalizedBankName,
          taxNumber: normalizedTaxNumber,
          hireDate,
          status: rest.isActive ? EmployeeStatus.ACTIVE : EmployeeStatus.INACTIVE
        }
      })

      await tx.contract.create({
        data: {
          employeeId: createdEmployee.id,
          startDate: hireDate,
          baseSalary: rest.baseSalary,
          workingTimeRate: 100,
          cnasEligible: true
        }
      })

      return createdEmployee
    })

    revalidatePath('/employees')
    revalidatePath(`/employees/${employee.id}`)

    return { success: true, employeeId: employee.id }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        fieldErrors: {
          employeeNumber: ['Employee number must be unique']
        }
      }
    }

    console.error('Failed to create employee', error)
    return {
      success: false,
      error: 'Failed to create employee. Please try again.'
    }
  }
}
